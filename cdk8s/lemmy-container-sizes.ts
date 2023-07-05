import {Quantity, ResourceRequirements} from "./imports/k8s";
import {PostgresqlSpecResources} from "./imports/acid.zalan.do";

/**
 * Size presets for the various lemmy containers.
 * These are currently rough estimates and haven't been tested. If these end up too big or too small, please leave feedback.
 * solo:   ~1-5 users per container
 * micro:  ~10-20 users per container
 * small:  ~50-100 users per container
 * medium: ~200-400 users per container
 * large:  ~1000-2000 users per container
 * xlarge: ~5000-10000 users per container
 */
export type ContainerSize = "solo" | "micro" | "small" | "medium" | "large" | "xlarge"

/**  Variables to create a custom container size */
export interface CustomContainerSize {
    cpuRequest: string
    memoryLimit: string
}

export interface LemmyContainerSizePreset {
    solo: CustomContainerSize
    micro: CustomContainerSize
    small: CustomContainerSize
    medium: CustomContainerSize
    large: CustomContainerSize
    xlarge: CustomContainerSize
}
export interface LemmyContainerSizePresets {
    backend: LemmyContainerSizePreset
    ui: LemmyContainerSizePreset
    pictrs: LemmyContainerSizePreset
    database: LemmyContainerSizePreset
}

export const lemmyContainerSizePreset: LemmyContainerSizePresets = {
    backend: {
        solo:   {cpuRequest: "20m",  memoryLimit: "100Mi"},
        micro:  {cpuRequest: "50m",  memoryLimit: "100Mi"},
        small:  {cpuRequest: "200m", memoryLimit: "200Mi"},
        medium: {cpuRequest: "500m", memoryLimit: "400Mi"},
        large:  {cpuRequest: "1",    memoryLimit: "1Gi"  },
        xlarge: {cpuRequest: "2",    memoryLimit: "2Gi"  },
    },
    ui: {
        solo:   {cpuRequest: "10m",  memoryLimit: "200Mi"},
        micro:  {cpuRequest: "50m",  memoryLimit: "200Mi"},
        small:  {cpuRequest: "100m", memoryLimit: "300Mi"},
        medium: {cpuRequest: "500m", memoryLimit: "500Mi"},
        large:  {cpuRequest: "1",    memoryLimit: "1Gi"  },
        xlarge: {cpuRequest: "2",    memoryLimit: "4Gi"  },
    },
    pictrs: {
        solo:   {cpuRequest: "20m",  memoryLimit: "100Mi"},
        micro:  {cpuRequest: "50m",  memoryLimit: "100Mi"},
        small:  {cpuRequest: "200m", memoryLimit: "200Mi"},
        medium: {cpuRequest: "500m", memoryLimit: "400Mi"},
        large:  {cpuRequest: "1",    memoryLimit: "1Gi"  },
        xlarge: {cpuRequest: "2",    memoryLimit: "2Gi"  },
    },
    database: {
        solo:   {cpuRequest: "50m",  memoryLimit: "1Gi"},
        micro:  {cpuRequest: "100m", memoryLimit: "1Gi"},
        small:  {cpuRequest: "200m", memoryLimit: "2Gi"},
        medium: {cpuRequest: "500m", memoryLimit: "4Gi"},
        large:  {cpuRequest: "1",    memoryLimit: "6Gi"},
        xlarge: {cpuRequest: "2",    memoryLimit: "8Gi"},
    }
}

export type ResourceSetting = ContainerSize | CustomContainerSize

export const getResourceBlockPresetString = (service: keyof LemmyContainerSizePresets,
                                             size: ContainerSize): PostgresqlSpecResources => {
    return {
        requests: {
            cpu: lemmyContainerSizePreset[service][size].cpuRequest
        },
        limits: {
            memory: lemmyContainerSizePreset[service][size].memoryLimit
        }
    }
}
export const getResourceBlockPresetQuantity = (service: keyof LemmyContainerSizePresets,
                                               size: ContainerSize): ResourceRequirements => {
    return {
        requests: {
            cpu: Quantity.fromString(lemmyContainerSizePreset[service][size].cpuRequest)
        },
        limits: {
            memory: Quantity.fromString(lemmyContainerSizePreset[service][size].memoryLimit)
        }
    }
}
export const getCustomResourceBlockString = (size: CustomContainerSize): PostgresqlSpecResources => {
    return {
        requests: {
            cpu: size.cpuRequest
        },
        limits: {
            memory: size.memoryLimit
        }
    }
}
export const getCustomResourceBlockQuantity = (size: CustomContainerSize): ResourceRequirements => {
    return {
        requests: {
            cpu: Quantity.fromString(size.cpuRequest)
        },
        limits: {
            memory: Quantity.fromString(size.memoryLimit)
        }
    }
}
export const getResourceBlockString = (setting: ResourceSetting, service: keyof LemmyContainerSizePresets): PostgresqlSpecResources => {
    if(typeof setting === 'string')
        return getResourceBlockPresetString(service, setting);
    else
        return getCustomResourceBlockString(setting);
}
export const getResourceBlockQuantity = (setting: ResourceSetting, service: keyof LemmyContainerSizePresets): ResourceRequirements => {
    if(typeof setting === 'string')
        return getResourceBlockPresetQuantity(service, setting);
    else
        return getCustomResourceBlockQuantity(setting);
}
