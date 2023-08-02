export interface MappedItem {
    itemName: string;
    mappedName: string;
}

export default class EasyCopyPaste {
    private readonly specialDelimiters = [` `, `'`, `-`, `/`, `.`, `#`, `!`, `:`, `(`, `)`];
    private mapCache: MappedItem[] = new Array();

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
    public toEasyCopyPasteString(str: string, boldChars: boolean = false): string {
        if (str.length === 0) {
            throw new Error("The input string's length must be greater than 0!")
        }

        return boldChars ? this.swapToBold(this.mapString(str)) : this.mapString(str);
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
                lowerStr === item.mappedName.toLowerCase() ||
                lowerStr === this.swapToDefault(item.mappedName.toLowerCase())
            );
        }) || null;
    }

    private readonly defaultCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    private readonly boldCharMap = '𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳';

    private swapToBold(input: string): string {
        let result = '';
        for (const char of input) {
          const charIndex = this.defaultCharMap.indexOf(char);
          if (charIndex !== -1) {
            const boldChar = this.boldCharMap[charIndex];
            result += boldChar;
          } else {
            result += char;
          }
        }
        return result;
      }
      
      private swapToDefault(input: string): string {
        let result = '';
        for (const char of input) {
          const charIndex = this.boldCharMap.indexOf(char);
          if (charIndex !== -1) {
            const defaultChar = this.defaultCharMap[charIndex];
            result += defaultChar;
          } else {
            result += char;
          }
        }
        return result;
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
            itemName: str,
            mappedName: strArr.join('')
        } as MappedItem;
    
        if (shouldSave) {
            this.mapCache.push(mapped);
        }
    
        return mapped.mappedName;
    }
}