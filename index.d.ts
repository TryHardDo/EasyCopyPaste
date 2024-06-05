export default class EasyCopyPaste {
    private useBoldChars;
    private useShortKeyWordMapping;
    private readonly delimiters;
    private readonly nativeCharSequence;
    private readonly boldCharSequence;
    private readonly keyWordMap;
    private readonly mappedItems;
    constructor(useBoldChars?: boolean, useShortKeyWordMapping?: boolean);
    /**
     * Turns the input char sequence into an easily copyable string while it saves the original form and
     * alternative forms into the heap.
     *
     * @param {string} itemOriginalName The item's original name
     * @param {'buy' | 'sell'} botSideIntent The intent from the bot's perspective
     * @returns
     */
    toEcpStr(itemOriginalName: string, botSideIntent: 'buy' | 'sell'): string;
    /**
     * Method to convert an easily copy-pasteable string back to the original format of the item's name.
     *
     * @param {string} ecpStr The ECP string which needs to be reversed back.
     * @returns {IntentDescriptor | undefined} IntentDescriptor if mapped value was found, undefined otherwise.
     */
    reverseEcpStr(ecpStr: string): IntentDescriptor | undefined;
    private findMappedValue;
    private mapString;
    private swapPreMappedKeywords;
    private swapToBoldChars;
    private swapToNativeChars;
}
/**
 * Interface for wrapping final results of ECP
 * into autobot interpreted formats.
 */
export interface IntentDescriptor {
    originalItemName: string;
    decodedIntent: 'buy' | 'sell';
}
