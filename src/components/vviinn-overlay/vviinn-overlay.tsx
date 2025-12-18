import { Component, h, Element, Prop, Watch } from "@stencil/core";

@Component({
  tag: "vviinn-overlay",
  styleUrl: "vviinn-overlay.css",
  shadow: true,
})
export class VviinnOverlay {
  @Element() el: HTMLElement;
  @Prop() active: boolean = false;

  private dialogRef?: HTMLDialogElement;

  @Watch("active")
  handleActiveChange(isActive: boolean) {
    if (!this.dialogRef) return;

    if (isActive && !this.dialogRef.open) {
      this.dialogRef.showModal();
    } else if (!isActive && this.dialogRef.open) {
      this.dialogRef.close();
    }
  }

  componentDidLoad() {
    if (this.active && this.dialogRef) {
      this.dialogRef.showModal();
    }
  }

  render() {
    return (
      <dialog ref={(el) => (this.dialogRef = el)}>
        <slot></slot>
      </dialog>
    );
  }
}
