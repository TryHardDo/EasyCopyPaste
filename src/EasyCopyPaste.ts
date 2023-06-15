import fs from 'fs/promises';
import { join } from 'path';

export type CharMap = Map<number, string>;

export interface MappedItem {
    itemName: string;
    mappedName: string;
}

export default class EasyCopyPaste {
    private readonly mapFileName: string;
    private readonly mapFileLocation: string;
    private readonly specialDelimiters = [`'`, `-`, `/`];

    public constructor(mapFileName: string, mapFileLocation: string) {
        this.mapFileName = mapFileName;
        this.mapFileLocation = mapFileLocation;
    }

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
    public async toEasyCopyPasetString(str: string): Promise<string> {
        if (str.length === 0) {
            throw new Error("The input string's length must be greater than 0!")
        }

        return await this.mapString(str);
    }

    /**
     * Method to convert easy copy paste string back to the item's original format.
     * If the item is in the special mapped item names we will return the stored original name.
     * 
     * If the item is not in the special item names mape we just replace the underscores to spaces.
     * @param str The easy copy paste string
     * @returns The original item name
     */
    public async fromEasyCopyPasteString(str: string): Promise<string> {
        if (str.length === 0) {
            throw new Error("The input string's length must be greater than 0!")
        }

        return await this.reverseMapString(str);
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

    private async reverseMapString(str: string): Promise<string> {
        const storedMap = await this.loadMapData();

        const found = this.findMappedValue(str, storedMap);
        if (found !== null) {
            return found.itemName;
        }

        return str.replace(/_/g, ' ');
    }

    private async mapString(str: string): Promise<string> {
        const storedMap = await this.loadMapData();

        const found = this.findMappedValue(str, storedMap);
        if (found !== null) {
            return found.mappedName;
        }

        let shouldSave = false;
        const easyDelimiter = '_';
        const strArr = str.split('').map((char) => {
            if (this.specialDelimiters.includes(char)) {
                shouldSave = true;
                return easyDelimiter;
            }

            if (char === ' ') {
                return easyDelimiter;
            }

            return char;
        });

        const mapped = {
            itemName: str,
            mappedName: strArr.join('')
        } as MappedItem;
    
        if (shouldSave) {
            storedMap.push(mapped);
            await this.saveMapData(storedMap);
        }

        return mapped.mappedName;
    }
 
    private async saveMapData(mappedItems: MappedItem[]): Promise<void> {
        try {
            await fs.mkdir(this.mapFileLocation, { recursive: true });

            const json = JSON.stringify(mappedItems);
            await fs.writeFile(join(this.mapFileLocation, this.mapFileName), json, { flag: 'w+' });
        } catch (err) {
            console.error('An error occurred while saving map data:', err);
        }
    }

    private async loadMapData(): Promise<MappedItem[]> {
        try {
            const rawData = await fs.readFile(join(this.mapFileLocation, this.mapFileName), { encoding: 'utf-8', flag: 'r' });
            const obj = JSON.parse(rawData.length === 0 ? '[]' : rawData) as MappedItem[];

            if (obj) {
                return obj;
            }
        } catch (err) {
            const nodeErr = err as NodeJS.ErrnoException;
        
            if (nodeErr.code === 'ENOENT') {
                console.log('File does not exist. Creating new file.');
                await this.saveMapData(new Array());
            } else {
                console.error('An unexpected error occurred:', nodeErr);
            }
        }

        return new Array();
    }
}