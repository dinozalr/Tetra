import {
  Attachment,
  AttachmentBuilder,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

import fetch from "node-fetch";

import { FeedbackManager } from "../utils/managers/FeedbackManager";
import { DiscordBot } from "../types";
//@ts-ignore
import * as tiktok from "tiktok-video-downloader";

const importEmote = {
  data: new SlashCommandBuilder()
    .setName("tiktok")
    .setDescription("tiktacz")
    .addStringOption((option) =>
      option.setName("url").setDescription("tiktok url").setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction, client: DiscordBot) {
    // const ephemeral = !interaction.memberPermissions!.has(
    //   "ManageEmojisAndStickers"
    // );
    // const feedback = new FeedbackManager(interaction, { ephemeral });
    try {
      await interaction.reply("<a:PepegaLoad:1085673146939621428>");
      const urlVideo = interaction.options.getString("url");

      if (!urlVideo) return;

      const data = await tiktok.getInfo(urlVideo);
      // data.video.url.no_wm

      const source = await fetch(data.video.url.no_wm);
      const video = await source.buffer();

      const attachmnetOho = new AttachmentBuilder(video);
      attachmnetOho.setName("video.mp4");
      await interaction.editReply({
        files: [attachmnetOho],
        content: "",
      });
    } catch (error) {
      await interaction.editReply(`cos jeblo! ${String(error)}`);
    }
  },
};

export default importEmote;
