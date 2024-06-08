export default class EasyCopyPaste {
    private readonly delimiters;
    private readonly nativeCharSequence;
    private readonly boldCharSequence;
    private readonly mappedItems;
    private _useBoldChars;
    private _useWordSwap;
    private _keyWordMap;
    get useBoldChars(): boolean;
    set useBoldChars(useBoldChars: boolean);
    get useWordSwap(): boolean;
    set useWordSwap(useWordSwap: boolean);
    get keyWordMap(): Map<string, string>;
    set keyWordMap(wordMap: Map<string, string>);
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
