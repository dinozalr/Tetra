import { MediaCommandError, PlatformResult } from "../../commands/media";
import { guildParsePremium } from "../discord/guildParsePremium";
import { FeedbackManager } from "../managers/FeedbackManager";
import yt, { type Format } from "youtube-dl-exec";

const supportedQualities = ["240p", "360p", "480p", "720p"];
const supportedLengthVideos = 400;

export const handleYoutubeMedia = async (
  _url: string,
  feedback: FeedbackManager
): Promise<PlatformResult> => {
  const { fileLimit } = guildParsePremium(feedback.interaction.guild!);

  const { formats, duration, channel, title, view_count } = await yt(_url, {
    dumpSingleJson: true,
    noWarnings: true,
    preferFreeFormats: true,
  });

  console.log("initial output:", formats);

  if (duration > supportedLengthVideos) {
    throw new Error("For now, only videos up to 6:34 minutes are supported");
  }

  const eligableFormats = formats.filter((format) => {
    const { acodec, vcodec } = format;
    return acodec !== "none" && vcodec !== "none";
  });

  console.log("eligable formats:", eligableFormats);

  if (eligableFormats.length === 0) {
    throw new Error("No supported format found with audio and video.");
  }

  const formatsWithSize = await Promise.all(
    eligableFormats.map(async (format): Promise<Format> => {
      const request = await fetch(format.url, { method: "HEAD" });
      const headers = request.headers;

      const size = headers.get("Content-Length");

      return {
        ...format,
        filesize: Number(size),
      };
    })
  );

  console.log("formats with size:", formatsWithSize);

  const selectedFormat = formatsWithSize
    .sort((a, b) => b.filesize! - a.filesize!)
    .find((format) => format.filesize! < fileLimit);

  if (!selectedFormat) {
    throw MediaCommandError.FILE_LIMIT_EXCEEDED;
  }

  console.log("final url:", selectedFormat.url);

  return {
    description: title,
    media: [
      {
        source: selectedFormat.url,
        type: "mp4",
        size: selectedFormat.filesize || undefined,
      },
    ],
    metadata: {
      author: channel,
      views: view_count,
    },
  };
};
