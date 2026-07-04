import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Presentational application shell: a header with a logo slot and title, plus a projected content area for the routed
 * view. Holds no state — a smart/container component supplies the title and projects the page.
 */
@Component({
    selector: 'app-shell',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="app-shell">
            <header class="app-shell__header">
                <div class="app-shell__brand">
                    <!-- Logo slot: project a logo image or leave the default mark. -->
                    <ng-content select="[logo]">
                        <span class="app-shell__logo" aria-hidden="true">◆</span>
                    </ng-content>
                    <span class="app-shell__title">{{ title() }}</span>
                </div>
            </header>
            <main class="app-shell__content">
                <ng-content />
            </main>
        </div>
    `,
    styles: `
        .app-shell {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .app-shell__header {
            display: flex;
            align-items: center;
            padding: 0.75rem 1.5rem;
            border-bottom: 1px solid var(--p-content-border-color, #e5e7eb);
        }
        .app-shell__brand {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
        }
        .app-shell__logo {
            font-size: 1.25rem;
        }
        .app-shell__content {
            flex: 1;
            padding: 1.5rem;
        }
    `,
})
export class AppShell {
    readonly title = input('wf-third');
}
