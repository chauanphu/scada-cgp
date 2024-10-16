export type Unit = {
    id: number,
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  }

export type Cluster = {
    id: number;
    name: string;
    url: string;
    units: Unit[];
};

export type UserShortened = {
    user_id: number;
    username: string;
}

export type ClusterFull = {
    name: string;
    id: number;
    units: Unit[];
    account: UserShortened;
    created: string;
    updated: string;
};

export type CreateClusterData = {
    name: string;
    units: Partial<Unit[]>;
    account_id: number;
}