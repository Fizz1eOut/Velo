import { reactive } from 'vue';

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  resolve: ((value: boolean) => void) | null;
}

const state = reactive<ConfirmState>({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  danger: false,
  resolve: null
});

function confirm(options: ConfirmOptions): Promise<boolean> {
  state.title = options.title ?? '';
  state.message = options.message;
  state.confirmText = options.confirmText ?? 'Confirm';
  state.cancelText = options.cancelText ?? 'Cancel';
  state.danger = options.danger ?? false;
  state.isOpen = true;

  return new Promise<boolean>((resolve) => {
    state.resolve = resolve;
  });
}

function handleConfirm() {
  state.resolve?.(true);
  state.isOpen = false;
}

function handleCancel() {
  state.resolve?.(false);
  state.isOpen = false;
}

export function useConfirm() {
  return { confirm };
}

export function useConfirmState() {
  return { state, handleConfirm, handleCancel };
}
