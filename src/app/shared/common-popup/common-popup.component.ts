import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-common-popup',
  templateUrl: './common-popup.component.html',
  styleUrls: ['./common-popup.component.css'] // optional
})
export class CommonPopupComponent {
  @Input() type: 'success' | 'warning' | 'info' | 'confirm' = 'info';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() show: boolean = false;

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  getHeaderClass(): string {
    switch (this.type) {
      case 'success': return 'bg-success text-white';
      case 'warning': return 'bg-warning text-dark';
      case 'info': return 'bg-info text-white';
      case 'confirm': return 'bg-secondary text-white';
      default: return 'bg-primary text-white';
    }
  }

  confirm() {
    this.onConfirm.emit();
    this.show = false;
  }

  cancel() {
    this.onCancel.emit();
    this.show = false;
  }

  close() {
    this.onClose.emit();
    this.show = false;
  }
}
