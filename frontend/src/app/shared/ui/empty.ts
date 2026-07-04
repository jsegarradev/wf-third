import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Presentational empty-state placeholder. Show when a successful request returns no rows.
 */
@Component({
    selector: 'app-empty',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="app-empty" role="status">
            <p class="app-empty__message">{{ message() }}</p>
        </div>
    `,
    styles: `
        .app-empty {
            padding: 2rem;
            text-align: center;
            color: var(--p-text-muted-color, #6b7280);
        }
    `,
})
export class Empty {
    readonly message = input('Nothing to show yet.');
}
