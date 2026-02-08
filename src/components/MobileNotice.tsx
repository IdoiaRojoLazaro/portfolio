import {useState, useEffect} from 'react';

const STORAGE_KEY = 'portfolio-mobile-notice-dismissed';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

function buildCalendarUrl(): string {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const title = encodeURIComponent("View Idoia's portfolio on desktop");
  const desc = encodeURIComponent(`Open this link on a computer for the full experience:\n${url}`);
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(9, 0, 0, 0);
  const end = new Date(start);
  end.setHours(10, 0, 0, 0);
  const format = (d: Date) => d.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${desc}&dates=${format(start)}/${format(end)}`;
}

function downloadIcs() {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(9, 0, 0, 0);
  const format = (d: Date) => d.toISOString().replace(/-|:|\.\d{3}/g, '');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${format(start)}`,
    `DTEND:${format(new Date(start.getTime() + 3600000))}`,
    "SUMMARY:View Idoia's portfolio on desktop",
    `DESCRIPTION:Open on computer: ${url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'portfolio-reminder.ics';
  a.click();
  URL.revokeObjectURL(a.href);
}

export function MobileNotice() {
  const [dismissed, setDismissed] = useState(() =>
    typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(STORAGE_KEY) === '1' : false
  );
  const [copied, setCopied] = useState(false);

  const isMobile = useIsMobile();

  const handleContinue = () => {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setDismissed(true);
  };

  const handleOpenEmail = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const subject = encodeURIComponent("Reminder: View Idoia's portfolio on desktop");
    const body = encodeURIComponent(
      `Reminder to view this portfolio on a computer for the full experience:\n\n${url}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    sessionStorage.setItem(STORAGE_KEY, '1');
    setDismissed(true);
  };

  const handleCopyLink = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: open share sheet on mobile if available
      if (navigator.share) {
        navigator.share({ title: "Idoia's portfolio", url, text: 'View on desktop for the full experience' }).catch(() => {});
      }
    }
  };

  if (!isMobile || dismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
      <div className="bg-vscode-card border border-vscode-border rounded-lg p-6 max-w-md w-full font-mono text-sm shadow-xl">
        <div className="text-accent-success text-base font-medium mb-2">
          // Best on desktop
        </div>
        <p className="text-vscode-fg leading-relaxed mb-4">
          This portfolio is designed to feel like a programmer's environment. For the full experience we recommend viewing it on a computer.
        </p>
        <p className="text-gray-500 text-xs mb-4">
          Get a reminder when you're at your computer:
        </p>
        <div className="flex flex-col gap-2">
          <a
            href={buildCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { sessionStorage.setItem(STORAGE_KEY, '1'); setDismissed(true); }}
            className="w-full py-2.5 px-3 bg-accent-success text-black font-medium rounded border border-accent-success text-center hover:opacity-90 transition-opacity"
          >
            Add to Google Calendar
          </a>
          <button
            type="button"
            onClick={() => { downloadIcs(); sessionStorage.setItem(STORAGE_KEY, '1'); setDismissed(true); }}
            className="w-full py-2.5 px-3 border border-vscode-border text-vscode-fg rounded hover:bg-vscode-border/30 transition-colors"
          >
            Download .ics (Apple / Outlook)
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full py-2.5 px-3 border border-vscode-border text-gray-400 rounded hover:bg-vscode-border/30 hover:text-vscode-fg transition-colors flex items-center justify-center gap-2"
          >
            {copied ? '✓ Link copied!' : 'Copy link'}
          </button>
          <button
            type="button"
            onClick={handleOpenEmail}
            className="w-full py-2.5 px-3 border border-vscode-border text-vscode-fg rounded hover:bg-vscode-border/30 transition-colors"
          >
            Open email
          </button>
        </div>
        <button
          type="button"
          onClick={handleContinue}
          className="w-full mt-3 py-2 text-gray-500 hover:text-vscode-fg text-xs transition-colors"
        >
          Continue on mobile anyway
        </button>
      </div>
    </div>
  );
}
