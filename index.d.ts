export default class EasyCopyPaste {
    private useBoldChars;
    private useShortKeyWordMapping;
    private readonly delimiters;
    private readonly nativeCharSequence;
    private readonly boldCharSequence;
    private readonly keyWordMap;
    private readonly mappedItems;
    constructor(useBoldChars?: boolean, useShortKeyWordMapping?: boolean);
    toEcpStr(itemOriginalName: string, botSideIntent: 'buy' | 'sell'): string;
    reverseEcpStr(ecpStr: string): IntentDescriptor | undefined;
    private findMappedValue;
    private constructEcpCharSequence;
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
