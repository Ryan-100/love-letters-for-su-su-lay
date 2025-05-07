import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getLettersByMood = query({
  args: { mood: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("letters")
      .withIndex("by_mood", q => q.eq("mood", args.mood))
      .collect();
  }
});

export const openLetter = mutation({
  args: { letterId: v.id("letters") },
  handler: async (ctx, args) => {
    const letter = await ctx.db.get(args.letterId);
    if (!letter) throw new Error("Letter not found");
    await ctx.db.patch(args.letterId, { opened: true });
    return letter;
  }
});

// Seed romantic letters
export const seedLetters = mutation({
  handler: async (ctx) => {
    const letters = [
      {
        mood: "love",
        title: "Secret Admirer",
        content: "Every time I see you, my heart sparkles like redstone. You're more precious than diamonds! 💝",
        opened: false
      },
      {
        mood: "love",
        title: "Love Note",
        content: "If Minecraft had a love potion, I'd craft it just for you. You make my world brighter than glowstone! ✨",
        opened: false
      },
      {
        mood: "love",
        title: "Love Note",
        content: "If Minecraft had a love potion, I'd craft it just for you. You make my world brighter than glowstone! ✨",
        opened: false
      },
      {
        mood: "love",
        title: "Love Note",
        content: "If Minecraft had a love potion, I'd craft it just for you. You make my world brighter than glowstone! ✨",
        opened: false
      },
      {
        mood: "romantic",
        title: "Heart's Whisper",
        content: "Like two hearts beating in perfect harmony, we're meant to build our world together. Will you be my player two? 💕",
        opened: false
      },
      {
        mood: "romantic",
        title: "Love's Promise",
        content: "In a world full of blocks, you're the one that completes my build. Let's create something beautiful together! 🏰",
        opened: false
      },
      {
        mood: "happiness",
        title: "Playful Heart",
        content: "Are you a creeper? Because you just blew me away! Want to go mining for diamonds together? 💎",
        opened: false
      },
      {
        mood: "happiness",
        title: "Sweet Nothing",
        content: "If you were a potion, you'd be Potion of Attraction III. Your smile enchants me more than any enchanting table could! ✨",
        opened: false
      },
      {
        mood: "sadness",
        title: "Distance Hearts",
        content: "Even when we're in different biomes, my heart finds its way back to you. Missing you more than my lost diamond pickaxe! 💔",
        opened: false
      },
      {
        mood: "sadness",
        title: "Love's Echo",
        content: "Like a compass always pointing home, my heart always points to you. Can't wait to see you again! 🧭",
        opened: false
      }
    ];

    // Clear existing letters before seeding
    const existingLetters = await ctx.db.query("letters").collect();
    for (const letter of existingLetters) {
      await ctx.db.delete(letter._id);
    }

    // Insert new letters
    for (const letter of letters) {
      await ctx.db.insert("letters", letter);
    }
  }
});
