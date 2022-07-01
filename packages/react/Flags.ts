export const NoFlags = /*                      */ 0b00000000000000000000
// 新增、插入、移动
export const Placement = /*                    */ 0b0000000000000000000010 // 2
// 更新节点属性
export const Update = /*                       */ 0b0000000000000000000100 // 4
export const Deletion = /*                     */ 0b0000000000000000001000 // 8
// Effect
export const HookLayout = /*                   */ 0b0100
export const HookPassive = /*                  */ 0b1000
