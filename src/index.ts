export interface MappedItem {
    itemName: string;
    mappedName: string;
}

export interface TransactionDescriptor {
    itemName: string;
    command: 'buy' | 'sell'
}

export default class EasyCopyPaste {
    private readonly specialDelimiters = [` `, `'`, `-`, `/`, `.`, `#`, `!`, `:`, `(`, `)`];
    private mapCache: MappedItem[] = new Array();
    private readonly wordReplacements = Object.fromEntries([
        ["Mann Co. Supply Crate Key", "Key"],
        ["Killstreak", "Ks"],
        ["Professional", "Pro"],
        ["Specialized", "Spec"]
    ]);

    /**
     * Method to convert item names into easily copy-pasteable strings.
     *
     * If an item is considered 'exceptional' (i.e., its name contains special delimiters such as ',' '.' '-'), 
     * this method will replace those delimiters too and saves the string pair to an array where later
     * we can retrieve it.
     *
     * If the item's name contains only spaces as delimiters (i.e., it's not 'exceptional'), 
     * we don't store the string pair because such strings are easily reversible.
     *
     * @param {string} str The original item name to be parsed.
     * @param {boolean} boldChars Swapping the chars to it's bolder version.
     * @returns {string} The parsed item name, ready for easy copying and pasting.
     */
    public toEasyCopyPasteString(str: string, intent: 'buy' | 'sell', boldChars: boolean = true): string {
        if (str.length === 0) {
            throw new Error("The input string's length must be greater than 0!")
        }

        const intentStr = intent === 'buy' ? 'sell' : 'buy';
        const baseStr = `${intentStr}_${this.mapString(str)}`;
        return boldChars ? this.swapToBold(baseStr) : this.mapString(baseStr);
    }

    /**
     * Method to convert an easily copy-pasteable string back to the original format of the item's name.
     *
     * If the string corresponds to an item in the 'special' mapped item names, the method returns the stored original name.
     *
     * If the string does not correspond to a 'special' item name, the method replaces underscores with spaces.
     *
     * @param {string} str The easy copy-paste string.
     * @returns {TransactionDescriptor} Object which contains the original item name and the command type for checkout.
     */
    public fromEasyCopyPasteString(str: string): TransactionDescriptor {
        if (str.length === 0) {
            throw new Error("The input string's length must be greater than 0!")
        }

        const normalized = this.swapToDefault(str);
        let cmd = normalized.startsWith('sell_') ? 'sell' : 'buy';
        const clear = normalized.replace(`${cmd}_`, '');

        return {
            itemName: this.reverseMapString(clear),
            command: cmd
        } as TransactionDescriptor;
    }

    /**
     * Method to replace long words with shortened versions and vice versa.
     *
     * @param {string} str The input string.
     * @param {boolean} shorten Whether to shorten or lengthen the words.
     * @returns {string} The modified string with long/short words replaced.
     */
    private replaceLongWords(str: string, shorten: boolean): string {
        // Replace words with their shortened or lengthened versions
        for (const [word, replacementWord] of Object.entries(this.wordReplacements)) {
            const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape special characters
            const wordRegex = new RegExp(`\\b${escapedWord.replace(/ /g, '\\s')}\\b`, 'gi');
            str = str.replace(wordRegex, (match) =>
                shorten ? replacementWord : match
            );
        }
        return str;
    }

    private findMappedValue(str: string, mappedItems: MappedItem[]): MappedItem | null {
        const lowerStr = str.toLowerCase();

        return mappedItems.find((item) => {
            return (
                lowerStr === item.itemName.toLowerCase() ||
                lowerStr === item.mappedName.toLowerCase()
            );
        }) || null;
    }

    private defaultChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    private boldChars = '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵';

    private swapToDefault(str: string) {
        let decoded = '';

        for (let i = 0; i < str.length; i++) {
            const index = this.boldChars.indexOf(str[i] + str[i + 1]);

            if (index !== -1) {
                decoded += this.defaultChars[index / 2];
                i++;
            } else {
                decoded += str[i];
            }
        }

        return decoded;
    }

    private swapToBold(str: string) {
        let encoded = '';

        for (let i = 0; i < str.length; i++) {
            const index = this.defaultChars.indexOf(str[i]) * 2;

            if (index >= 0) {
                encoded += this.boldChars[index] + this.boldChars[index + 1];
            } else {
                encoded += str[i];
            }
        }

        return encoded;
    }

    private reverseMapString(str: string): string {
        const found = this.findMappedValue(str, this.mapCache);
        if (found !== null) {
            return found.itemName;
        }

        // Replace shortened words with long words
        let clear = str.replace(/_/g, ' ');
        return this.replaceLongWords(clear, false);
    }

    private mapString(str: string): string {
        const found = this.findMappedValue(str, this.mapCache);
        if (found !== null) {
            return found.mappedName;
        }
        const originalStr = str;
        // Replace long words with shortened versions
        str = this.replaceLongWords(str, true);

        let shouldSave = false;
        const easyDelimiter = '_';
        const strArr = str.split('');
        
        for (let i = 0; i < strArr.length; i++) {
            let char = strArr[i];
            
            if (this.specialDelimiters.includes(char)) {
                if (strArr[i + 1] === ' ' || this.specialDelimiters.includes(strArr[i + 1]) || strArr.length === i + 1) {
                    strArr[i] = '';
                } else {
                    strArr[i] = easyDelimiter;
                }
                shouldSave = true;
            }
            
            char = strArr[i];
        }
    
        const mapped = {
            itemName: originalStr,
            mappedName: strArr.join('')
        } as MappedItem;
    
        if (shouldSave) {
            this.mapCache.push(mapped);
        }
    
        return mapped.mappedName;
    }
}