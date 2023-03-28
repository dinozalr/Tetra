import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { ButtonStyle } from "discord.js";

const getManualAdjustmentRow = (taskId: string) => {
  const row = new ActionRowBuilder<ButtonBuilder>();
  row.addComponents(
    new ButtonBuilder()
      .setCustomId(`${taskId}:manual`)
      .setEmoji({ name: "🖋️" })
      .setLabel("ALPHA: Manual adjustment (better results)")
      .setStyle(ButtonStyle.Primary)
  );
  return row;
};

export default getManualAdjustmentRow;
