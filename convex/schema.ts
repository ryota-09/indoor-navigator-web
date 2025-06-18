import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Convex Authが管理するテーブル
  ...authTables,

  facilities: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    address: v.optional(v.string()),
    created_by: v.id("users"),
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_created_by", ["created_by"])
    .index("by_name", ["name"]),

  maps: defineTable({
    facility_id: v.id("facilities"),
    floor_number: v.number(),
    map_data: v.optional(v.string()),
    is_draft: v.boolean(),
    created_by: v.id("users"),
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_facility_id", ["facility_id"])
    .index("by_facility_and_floor", ["facility_id", "floor_number"])
    .index("by_created_by", ["created_by"])
    .index("by_is_draft", ["is_draft"]),
});