export default class EasyCopyPaste {
    private readonly delimiters = [` `, `'`, `-`, `/`, `.`, `#`, `!`, `:`, `(`, `)`, `,`];
    private readonly nativeCharSequence = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private readonly boldCharSequence = "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵";

    private readonly mappedItems = new Map<string, string[]>;

    private _useBoldChars = false;
    private _useWordSwap = false;
    private _keyWordMap = new Map<string, string>([
        ["Australium", "Aus"],
        ["Killstreak", "Ks"],
        ["Specialized", "Spec"],
        ["Professional", "Pro"],
        ["'s", "s"]
    ]);

    get useBoldChars(): boolean {
        return this._useBoldChars;
    }

    set useBoldChars(useBoldChars: boolean) {
        this._useBoldChars = useBoldChars;
    }

    get useWordSwap(): boolean {
        return this._useWordSwap;
    }

    set useWordSwap(useWordSwap: boolean) {
        this._useWordSwap = useWordSwap;
    }

    get keyWordMap(): Map<string, string> {
        return this._keyWordMap;
    }

    set keyWordMap(wordMap: Map<string, string>) {
        this._keyWordMap = wordMap;
    }

    public toEcpStr(itemOriginalName: string, botSideIntent: 'buy' | 'sell'): string {
        if (itemOriginalName.length === 0) throw new Error("Input could not be turned into ECP string because its length was 0!");

        // Customer side has inverted vision to intent. When they want to buy we actually having a sell listing.
        const customerSideIntent = botSideIntent === 'buy' ? 'sell' : 'buy';
        const mappedEcpEntry = this.mapString(itemOriginalName);

        let finalEcpStr = mappedEcpEntry.value[0];

        if (this.useWordSwap) {
            for (let ecpStrEntry of mappedEcpEntry.value) {
                if (ecpStrEntry.length < finalEcpStr.length) {
                    finalEcpStr = ecpStrEntry;
                }
            }
        }

        const nativeEcpString = `${customerSideIntent}_${finalEcpStr}`;

        if (this.useBoldChars) {
            return this.swapToBoldChars(nativeEcpString);
        }

        return nativeEcpString;
    }

    public reverseEcpStr(ecpStr: string): IntentDescriptor | undefined {
        if (ecpStr.length === 0) throw new Error("Input ECP string's lenght is 0!");

        let nativeStr = this.swapToNativeChars(ecpStr);

        // Lets decide what the customer want to do. Buy or sell stuffs.
        let customerIntent: undefined | 'buy' | 'sell' = undefined;
        if (nativeStr.startsWith('sell_')) {
            customerIntent = 'sell';
        } else if (nativeStr.startsWith('buy_')) {
            customerIntent = 'buy';
        }

        if (customerIntent === undefined) return undefined;

        const intentClearedEcpStr = nativeStr.replace(`${customerIntent}_`, '')
        const itemMappedOriginalName = this.findMappedValue(intentClearedEcpStr);

        if (itemMappedOriginalName === undefined) throw new Error("The item name was not found in the ECP map!");

        return {
            originalItemName: itemMappedOriginalName.key,
            decodedIntent: customerIntent
        };
    }

    private findMappedValue(str: string): KeyValuePair<string, string[]> | undefined {
        if (str.length === 0) throw new Error("Input sequence length is 0!");

        let lowerCaseStr = str.toLowerCase();
        for (let [key, value] of this.mappedItems) {
            const currentPair = { key, value };

            if (key.toLowerCase() === lowerCaseStr) return currentPair;
            if (value.length === 0) break;

            for (let entry of value) {
                if (entry.toLowerCase() === lowerCaseStr) return currentPair;
            }
        }

        return undefined;
    }

    private constructEcpCharSequence(originalItemName: string): string {
        const ecpStrDelimiter = '_';
        const charArray = originalItemName.split('');

        for (let i = 0; i < charArray.length; i++) {
            let selectedChar = charArray[i];

            if (this.delimiters.includes(selectedChar)) {
                if (charArray[i + 1] === ' ' ||
                    this.delimiters.includes(charArray[i + 1]) ||
                    charArray.length === i + 1
                ) {
                    charArray[i] = '';
                } else {
                    charArray[i] = ecpStrDelimiter;
                }
            }
        }

        return charArray.join('');
    }

    private mapString(itemName: string): KeyValuePair<string, string[]> {
        if (itemName.length === 0) throw new Error("Could not map input to ECP format because the input sequence's length is 0!");
        const foundEntry = this.findMappedValue(itemName);

        if (foundEntry !== undefined) {
            return foundEntry;
        }

        let ecpFormatSet = new Set<string>();

        ecpFormatSet.add(this.constructEcpCharSequence(itemName));
        ecpFormatSet.add(this.constructEcpCharSequence(this.swapPreMappedKeywords(itemName)));
        ecpFormatSet.add(this.swapPreMappedKeywords(this.constructEcpCharSequence(itemName)));

        const ecpFormatDistinctArray = [...ecpFormatSet];
        this.mappedItems.set(itemName, ecpFormatDistinctArray);

        return { key: itemName, value: ecpFormatDistinctArray };
    }

    private swapPreMappedKeywords(ecpString: string): string {
        let result = ecpString;

        for (let [keyword, value] of this.keyWordMap) {
            const regex = new RegExp(keyword, 'gi');
            result = result.replace(regex, value);
        }

        return result;
    }

    private swapToBoldChars(str: string): string {
        let charSeq = [];

        for (let i = 0; i < str.length; i++) {
            const index = this.nativeCharSequence.indexOf(str[i]) * 2;

            if (index >= 0) {
                charSeq.push(this.boldCharSequence[index] + this.boldCharSequence[index + 1]);
            } else {
                charSeq.push(str[i]);
            }
        }

        return charSeq.join('');
    }

    private swapToNativeChars(str: string): string {
        let charSeq = [];

        for (let i = 0; i < str.length; i++) {
            const index = this.boldCharSequence.indexOf(str[i] + str[i + 1]);

            if (index !== -1) {
                charSeq.push(this.nativeCharSequence[index / 2]);
                i++;
            } else {
                charSeq.push(str[i]);
            }
        }

        return charSeq.join('');
    }
}

/**
 * Interface for wrapping final results of ECP
 * into autobot interpreted formats.
 */
export interface IntentDescriptor {
    originalItemName: string;
    decodedIntent: 'buy' | 'sell';
}

interface KeyValuePair<K, V> {
    key: K;
    value: V;
}