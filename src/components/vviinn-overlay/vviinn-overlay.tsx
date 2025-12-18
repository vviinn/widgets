import { Component, h, Prop, Watch } from "@stencil/core";

@Component({
  tag: "vviinn-overlay",
  styleUrl: "vviinn-overlay.css",
  shadow: true,
})
export class VviinnOverlay {
  @Prop({ reflect: true }) active: boolean = false;

  private dialogRef?: HTMLDialogElement;
  private isClosing: boolean = false;

  @Watch("active")
  handleActiveChange(isActive: boolean) {
    requestAnimationFrame(() => {
      if (!this.dialogRef) return;

      if (isActive && !this.dialogRef.open) {
        this.isClosing = false;
        this.dialogRef.classList.remove("closing");
        this.dialogRef.showModal();
      } else if (!isActive && this.dialogRef.open && !this.isClosing) {
        this.isClosing = true;
        this.dialogRef.classList.add("closing");
      }
    });
  }

  private handleAnimationEnd = (event: AnimationEvent) => {
    if (event.animationName === "fade-out" && this.isClosing) {
      this.isClosing = false;
      this.dialogRef?.close();
    }
  };

  componentDidLoad() {
    if (this.active && this.dialogRef) {
      this.dialogRef.showModal();
    }
  }

  render() {
    return (
      <dialog
        ref={(el) => (this.dialogRef = el)}
        onAnimationEnd={this.handleAnimationEnd}
      >
        <slot></slot>
      </dialog>
    );
  }
}
