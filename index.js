"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EasyCopyPaste {
    constructor() {
        this.specialDelimiters = [` `, `'`, `-`, `/`, `.`, `#`, `!`, `:`, `(`, `)`];
        this.mapCache = new Array();
        this.defaultChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        this.boldChars = '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵';
    }
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
    toEasyCopyPasteString(str, boldChars = true) {
        if (str.length === 0) {
            throw new Error("The input string's length must be greater than 0!");
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
    fromEasyCopyPasteString(str) {
        if (str.length === 0) {
            throw new Error("The input string's length must be greater than 0!");
        }
        return this.reverseMapString(str);
    }
    findMappedValue(str, mappedItems) {
        const lowerStr = this.swapToDefault(str).toLowerCase();
        return mappedItems.find((item) => {
            return (lowerStr === item.itemName.toLowerCase() ||
                lowerStr === item.mappedName.toLowerCase());
        }) || null;
    }
    swapToDefault(str) {
        let decoded = '';
        for (let i = 0; i < str.length; i++) {
            const index = this.boldChars.indexOf(str[i] + str[i + 1]);
            if (index !== -1) {
                decoded += this.defaultChars[index / 2];
                i++;
            }
            else {
                decoded += str[i];
            }
        }
        return decoded;
    }
    swapToBold(str) {
        let encoded = '';
        for (let i = 0; i < str.length; i++) {
            const index = this.defaultChars.indexOf(str[i]) * 2;
            if (index >= 0) {
                encoded += this.boldChars[index] + this.boldChars[index + 1];
            }
            else {
                encoded += str[i];
            }
        }
        return encoded;
    }
    reverseMapString(str) {
        const found = this.findMappedValue(str, this.mapCache);
        if (found !== null) {
            return found.itemName;
        }
        return str.replace(/_/g, ' ');
    }
    mapString(str) {
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
                }
                else {
                    strArr[i] = easyDelimiter;
                }
                shouldSave = true;
            }
            char = strArr[i];
        }
        const mapped = {
            itemName: str,
            mappedName: strArr.join('')
        };
        if (shouldSave) {
            this.mapCache.push(mapped);
        }
        return mapped.mappedName;
    }
}
exports.default = EasyCopyPaste;
