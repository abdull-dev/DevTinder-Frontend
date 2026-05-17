"use client";

function SparkleIcon() {
  return (
    <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

interface BioSectionProps {
  bio: string;
  isEditing: boolean;
  onToggleEdit: () => void;
  onUpdate: (bio: string) => void;
  maxLength?: number;
}

export function BioSection({ bio, isEditing, onToggleEdit, onUpdate, maxLength = 500 }: BioSectionProps) {
  return (
    <section className="backdrop-blur-[20px] bg-surface/60 rounded-xl p-6 border border-white/40 shadow-[0_10px_30px_rgba(255,117,140,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SparkleIcon />
          <h2 className="text-xl font-bold text-on-surface">My Story</h2>
        </div>
        <button
          onClick={onToggleEdit}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isEditing
              ? "bg-primary text-on-primary shadow-md"
              : "bg-surface-container-high/60 text-on-surface-variant hover:bg-primary-container/30 hover:text-primary"
          }`}
        >
          {isEditing ? <CheckIcon /> : <EditIcon />}
        </button>
      </div>
      {isEditing ? (
        <div className="relative">
          <textarea
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-[1rem] p-4 text-on-surface min-h-[140px] resize-none transition-all duration-300 placeholder:text-on-surface-variant/50 focus:border-secondary/30 outline-none focus:shadow-[0_0_0_4px_rgba(115,54,205,0.15)]"
            placeholder="Write something that compiles directly to the heart..."
            value={bio}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) onUpdate(e.target.value);
            }}
          />
          <div className="absolute bottom-3 right-3 text-xs text-on-surface-variant/50 font-mono">
            {bio.length}/{maxLength}
          </div>
        </div>
      ) : (
        <p className="text-on-surface-variant leading-relaxed whitespace-pre-line">
          {bio || <span className="italic text-on-surface-variant/40">No bio yet...</span>}
        </p>
      )}
    </section>
  );
}
