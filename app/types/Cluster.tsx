export type Unit = {
    id: number,
    name: string;
    mac: string;
    latitude?: number;
    longitude?: number;
    toggle?: boolean;
  }

export type Cluster = {
    id: number;
    name: string;
    // url: string;
    units: Unit[];
};

export type UserShortened = {
    user_id: number;
    username: string;
}

export type ClusterFull = {
    id: number;
    name: string;
    units: Unit[];
    created: string;
    updated: string;
};

export type CreateUnit = {
    id?: Partial<number | null | undefined>;
    name: string;
    mac: string;
};

export type CreateClusterData = {
    name: string;
    units: Partial<CreateUnit[]>;
}