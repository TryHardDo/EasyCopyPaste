import fs from 'fs';
import { join } from 'path';

export type CharMap = Map<number, string>;

export interface MappedItem {
    itemName: string;
    mappedName: string;
}

export default class EasyCopyPaste {
    private readonly specialDelimiters = [`'`, `-`, `/`, `.`];
    private mapCache: MappedItem[] = new Array();

    constructor(private mapFileName: string, private mapFileLocation: string) {}

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
    public toEasyCopyPasteString(str: string): string {
        if (str.length === 0) {
            throw new Error("The input string's length must be greater than 0!")
        }

        return this.mapString(str);
    }

    /**
     * Method to convert easy copy paste string back to the item's original format.
     * If the item is in the special mapped item names we will return the stored original name.
     * 
     * If the item is not in the special item names mape we just replace the underscores to spaces.
     * @param str The easy copy paste string
     * @returns The original item name
     */
    public fromEasyCopyPasteString(str: string): string {
        if (str.length === 0) {
            throw new Error("The input string's length must be greater than 0!")
        }

        return this.reverseMapString(str);
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

    private reverseMapString(str: string): string {
        const found = this.findMappedValue(str, this.mapCache);
        if (found !== null) {
            return found.itemName;
        }

        return str.replace(/_/g, ' ');
    }

    private mapString(str: string): string {
        const found = this.findMappedValue(str, this.mapCache);
        if (found !== null) {
            return found.mappedName;
        }
    
        let shouldSave = false;
        const easyDelimiter = '_';
        const strArr = str.split('');
        
        for (let i = 0; i < strArr.length; i++) {
            let char = strArr[i];
            
            if (this.specialDelimiters.includes(char)) {
                // If the next character is a space, replace current character with nothing
                if (strArr[i + 1] === ' ') {
                    strArr[i] = '';
                } else {
                    strArr[i] = easyDelimiter;
                }
                shouldSave = true;
            }
    
            if (char === ' ') {
                strArr[i] = easyDelimiter;
            }
        }
    
        const mapped = {
            itemName: str,
            mappedName: strArr.join('')
        } as MappedItem;
    
        if (shouldSave) {
            this.mapCache.push(mapped);
        }
    
        return mapped.mappedName;
    }
}