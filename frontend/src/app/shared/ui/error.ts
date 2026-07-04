import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ApiError } from '../../core/models/api-error.model';

/**
 * Presentational error-state panel. Renders the normalized {@link ApiError} produced by the error interceptor.
 */
@Component({
    selector: 'app-error',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="app-error" role="alert">
            <p class="app-error__message">{{ error()?.message ?? fallback() }}</p>
            @if (error()?.details?.length) {
                <ul class="app-error__details">
                    @for (detail of error()!.details; track detail) {
                        <li>{{ detail }}</li>
                    }
                </ul>
            }
        </div>
    `,
    styles: `
        .app-error {
            padding: 1rem 1.25rem;
            border: 1px solid var(--p-red-300, #fca5a5);
            border-radius: 6px;
            background: var(--p-red-50, #fef2f2);
            color: var(--p-red-700, #b91c1c);
        }
        .app-error__details {
            margin: 0.5rem 0 0;
            padding-left: 1.25rem;
        }
    `,
})
export class ErrorState {
    readonly error = input<ApiError | null>(null);
    readonly fallback = input('Something went wrong.');
}
