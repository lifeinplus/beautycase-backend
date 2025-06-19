import type { MakeupBag } from "../../models/MakeupBagModel";

export const mockMakeupBagId = "682a378b09c4df2756fcece5";

export const mockMakeupBag1: MakeupBag = {
    categoryId: "682a378b09c4df2756fcece5",
    clientId: "683cbe0796c7f5d3d62101e0",
    stageIds: ["682a378b09c4df2756fcece5"],
    toolIds: ["683cbe0796c7f5d3d62101e0"],
};

export const mockMakeupBag2: MakeupBag = {
    categoryId: "683cbe0796c7f5d3d62101e0",
    clientId: "682a378b09c4df2756fcece5",
    stageIds: ["683cbe0796c7f5d3d62101e0"],
    toolIds: ["682a378b09c4df2756fcece5"],
};

export const mockMakeupBags: MakeupBag[] = [mockMakeupBag1, mockMakeupBag2];
