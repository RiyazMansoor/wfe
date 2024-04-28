

export class DataMap extends Map {

    toJSON() {

    }

}



export function toDataMapInstance(data: DataMap): DataMap {

    return new DataMap();
    
}
