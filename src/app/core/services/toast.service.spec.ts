import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService, Toast } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService]
    });

    service = TestBed.inject(ToastService);
  });

  // ─── Initial state ──────────────────────────────────────────────────────────

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty toasts', () => {
    expect(service.toasts()).toEqual([]);
  });

  // ─── Adding toasts ─────────────────────────────────────────────────────────

  it('should add a success toast', () => {
    service.success('Done', 'Operation completed');

    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].type).toBe('success');
    expect(toasts[0].title).toBe('Done');
    expect(toasts[0].message).toBe('Operation completed');
  });

  it('should add an error toast', () => {
    service.error('Failed', 'Something went wrong');

    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].type).toBe('error');
    expect(toasts[0].title).toBe('Failed');
  });

  it('should add a warning toast', () => {
    service.warning('Warning', 'Be careful');

    expect(service.toasts()[0].type).toBe('warning');
  });

  it('should add an info toast', () => {
    service.info('Info', 'FYI');

    expect(service.toasts()[0].type).toBe('info');
  });

  it('should accumulate multiple toasts', () => {
    service.success('First');
    service.error('Second');
    service.info('Third');

    expect(service.toasts().length).toBe(3);
  });

  it('should assign unique IDs to each toast', () => {
    service.success('One');
    service.success('Two');

    const ids = service.toasts().map(t => t.id);
    expect(ids[0]).not.toBe(ids[1]);
  });

  // ─── Dismissing toasts ──────────────────────────────────────────────────────

  it('should dismiss a toast by ID', () => {
    service.success('Keep');
    service.error('Remove');

    const toastToRemove = service.toasts().find(t => t.type === 'error')!;
    service.dismiss(toastToRemove.id);

    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].type).toBe('success');
  });

  it('should not fail when dismissing non-existent ID', () => {
    service.success('Existing');

    service.dismiss('non-existent-id');

    expect(service.toasts().length).toBe(1);
  });

  // ─── Auto-dismiss ──────────────────────────────────────────────────────────

  it('should auto-dismiss success toast after default duration', fakeAsync(() => {
    service.success('Auto-dismiss');

    expect(service.toasts().length).toBe(1);

    tick(4000); // default success duration

    expect(service.toasts().length).toBe(0);
  }));

  it('should auto-dismiss error toast after default duration', fakeAsync(() => {
    service.error('Auto-dismiss error');

    expect(service.toasts().length).toBe(1);

    tick(6000); // default error duration

    expect(service.toasts().length).toBe(0);
  }));

  it('should allow optional message parameter', () => {
    service.success('Title only');

    expect(service.toasts()[0].message).toBeUndefined();
  });
});
