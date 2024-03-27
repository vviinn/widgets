import {
  Component,
  Host,
  h,
  Event,
  EventEmitter,
  Prop,
  Watch,
} from "@stencil/core";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import {
  performMultiSearch,
  processSelectedFile,
} from "../../store/imageSearch.store";
import { BasicEventData, NoResultEventData } from "../../recommendation/events";
import { TextSearchIcon } from "../vviinn-icons";

/**
 * @part button -  button look and feel
 */
@Component({
  tag: "vviinn-text-search",
  styleUrl: "vviinn-text-search.css",
  shadow: true,
})
export class VviinnTextSearch {
  @Event() vviinnNoResult: EventEmitter<NoResultEventData>;
  /** @internal */
  @Event() vviinnImageUploadFinished: EventEmitter;

  @Prop() basicEventData: BasicEventData;
  @Prop() startSearch: boolean;
  @Prop() loading: boolean = false;
  @Prop() resetVpsButton: () => void;

  private async handleInputChange(event: Event) {
    const input = event.target as HTMLInputElement;

    performMultiSearch("flowers");

    const processingResult = await processSelectedFile(input.files[0]);

    pipe(
      processingResult,
      E.match(
        ({ kind }) =>
          this.vviinnNoResult.emit({
            ...this.basicEventData,
            reason: kind,
          }),
        () => this.vviinnImageUploadFinished.emit()
      )
    );

    input.value = null;
  }

  @Watch("startSearch")
  startSearchWatcher(search: boolean) {}

  render() {
    return (
      <Host exportparts="button">
        <input
          class="text-search-input"
          type="text"
          placeholder="Search by typing"
          onChange={(event: Event) => this.handleInputChange(event)}
        />
        <button class="text-search-button">
          <TextSearchIcon />
        </button>
      </Host>
    );
  }
}
