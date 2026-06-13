<script lang="ts">
  import { closeConfirm, dialogs } from "../state/dialogs.svelte";
  import { t } from "../state/i18n.svelte";

  let el: HTMLDialogElement | undefined = $state();

  $effect(() => {
    if (dialogs.confirm && el && !el.open) {
      el.showModal();
    } else if (!dialogs.confirm && el?.open) {
      el.close();
    }
  });

  const confirm = async () => {
    const options = dialogs.confirm;
    if (!options) return;
    await options.onConfirm();
    closeConfirm();
  };
</script>

<dialog
  bind:this={el}
  onclose={() => {
    if (dialogs.confirm) closeConfirm();
  }}
>
  {#if dialogs.confirm}
    <div class="dialog-head">
      <h2>{dialogs.confirm.title}</h2>
    </div>
    <div class="dialog-body">
      <p class="dialog-message">{dialogs.confirm.message}</p>
      <div class="dialog-actions">
        <span class="spacer"></span>
        <button class="ghost" type="button" onclick={closeConfirm}>{t("common.cancel")}</button>
        <button class="danger" type="button" onclick={confirm}>
          {dialogs.confirm.confirmText}
        </button>
      </div>
    </div>
  {/if}
</dialog>
