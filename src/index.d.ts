export type CharMap = Map<number, string>;
export interface MappedItem {
    itemName: string;
    mappedName: string;
}
export default class EasyCopyPaste {
    private mapFileName;
    private mapFileLocation;
    private readonly specialDelimiters;
    constructor(mapFileName: string, mapFileLocation: string);
    /**
     * Method to convert items to easy copy paste string.
     * If it is an exceptional item with special delimeter(s) in it's name
     * we map the item to be back convertable and save it to a file where the special
     * item names are located.
     *
     * If the item does not have special delimeter just spaces we wont save the item since it is
     * easily reverseable.
     * @param str The plain item name
     * @returns The parsed item name string
     */
    toEasyCopyPasteString(str: string): string;
    /**
     * Method to convert easy copy paste string back to the item's original format.
     * If the item is in the special mapped item names we will return the stored original name.
     *
     * If the item is not in the special item names mape we just replace the underscores to spaces.
     * @param str The easy copy paste string
     * @returns The original item name
     */
    fromEasyCopyPasteString(str: string): string;
    private findMappedValue;
    private reverseMapString;
    private mapString;
    private saveMapData;
    private loadMapData;
}
