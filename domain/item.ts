
export interface CommonFields {
    id?: string;
    title?: string;
    titleEn?: string;
    titleYomi?: string;
    lastUpdatedDate?: number;
    linkUrl?: string;
    thumbnailUrl?: string[];
    contentsUrl?: string[];
    iiifUrl?: string;
    contentsType?: string;
    contentsRightsType?: string;
    contentsAccess?: string;
    category?: string[];
    description?: string;
    descriptionEn?: string;
    contributor?: string[];
    temporal?: string[];
    location?: string[];
    provider?: string;
    providerUrl?: string;
    ownerOrg?: string;
    database?: string;
    subCategory?: string[];
    dclass?: string;
}

export interface RdfIndex {
    type: string[];
    temporal: string[];
}
export interface Item {
    id: string;
    common: CommonFields;
    rdfindex: RdfIndex;
    [others: string]: any;
}
export interface SearchResult {
    list: Item[];
    hit: number;
    from: number;
}
