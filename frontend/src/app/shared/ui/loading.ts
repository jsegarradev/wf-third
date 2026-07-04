import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

/**
 * Presentational loading indicator. Show while an async request is in flight.
 */
@Component({
    selector: 'app-loading',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ProgressSpinnerModule],
    template: `
        <div class="app-loading" role="status" [attr.aria-label]="label()">
            <p-progressSpinner strokeWidth="4" />
            <span class="app-loading__label">{{ label() }}</span>
        </div>
    `,
    styles: `
        .app-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
            padding: 2rem;
        }
    `,
})
export class Loading {
    readonly label = input('Loading…');
}
