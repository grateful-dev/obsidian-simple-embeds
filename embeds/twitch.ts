import { EmbedSource } from "./";
import { PluginSettings } from "settings";
//https://www.twitch.tv/videos/684670007?filter=all&sort=time
const TWITCH_LINK = new RegExp(
  /http(?:s?):\/\/(?:www\.)?twitch.tv\/videos\/(?<id>[0-9]*)\?/,
);
    
export class TwitchEmbed implements EmbedSource {
  canHandle(link: string, settings: PluginSettings) {
    return settings.replaceTwitchLinks && TWITCH_LINK.test(link);
  }

  createEmbed(link: string, container: HTMLElement) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("video-wrapper");
    const iframe = document.createElement("iframe");

    const matches = link.match(TWITCH_LINK);
    const videoId = matches.groups.id;
    const startTime = this._normalizeStartTime(matches.groups.startTime);
//<iframe src="https://player.twitch.tv/?video=684670007&parent=www.example.com" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>

    let src = `https://player.twitch.tv/?video=${videoId}`;
    if (startTime) {
      src = `${src}?start=${startTime}`;
    }
    iframe.src = src;
    iframe.title = "Twitch video player";
    iframe.setAttribute("frameborder", "0");
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;";
    iframe.setAttribute(
      "sandbox",
      "allow-scripts allow-same-origin allow-presentation allow-popups",
    );
    wrapper.appendChild(iframe);
    container.appendChild(wrapper);
    return container;
  }

  private _normalizeStartTime(startTime: string) {
    if (!startTime) {
      return;
    }
    if (!isNaN(Number(startTime))) {
      return startTime;
    }
    const matches = startTime.match(
      /(?<hours>\d+h)?(?<minutes>\d+m)?(?<seconds>\d+s)/,
    );
    const hoursInSeconds = parseInt(matches.groups.hours ?? "0") * 60 * 60;
    const minutesInSeconds = parseInt(matches.groups.minutes ?? "0") * 60;
    const seconds = parseInt(matches.groups.seconds ?? "0");
    return `${hoursInSeconds + minutesInSeconds + seconds}`;
  }
}