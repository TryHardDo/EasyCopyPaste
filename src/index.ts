export interface MappedItem {
    itemName: string;
    mappedName: string;
}

export default class EasyCopyPaste {
    private readonly specialDelimiters = [`'`, `-`, `/`, `.`, `#`, `!`, `:`, `(`, `)`];
    private mapCache: MappedItem[] = new Array();

    constructor() {}

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
     * @returns {string} The parsed item name, ready for easy copying and pasting.
     */
    public toEasyCopyPasteString(str: string): string {
        if (str.length === 0) {
            throw new Error("The input string's length must be greater than 0!")
        }

        return this.mapString(str);
    }

    /**
     * Method to convert an easily copy-pasteable string back to the original format of the item's name.
     *
     * If the string corresponds to an item in the 'special' mapped item names, the method returns the stored original name.
     *
     * If the string does not correspond to a 'special' item name, the method replaces underscores with spaces.
     *
     * @param {string} str The easy copy-paste string.
     * @returns {string} The original format of the item's name.
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