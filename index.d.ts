export interface MappedItem {
    itemName: string;
    mappedName: string;
}
export interface TransactionDescriptor {
    itemName: string;
    command: 'buy' | 'sell';
}
export default class EasyCopyPaste {
    private readonly specialDelimiters;
    private mapCache;
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
    toEasyCopyPasteString(str: string, intent: 'buy' | 'sell', boldChars?: boolean): string;
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
    fromEasyCopyPasteString(str: string): TransactionDescriptor;
    private findMappedValue;
    private defaultChars;
    private boldChars;
    private swapToDefault;
    private swapToBold;
    private reverseMapString;
    private mapString;
}
