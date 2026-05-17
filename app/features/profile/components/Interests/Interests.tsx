"use client";

import type { InterestTag } from "../../../../lib/types";

function GroupIcon() {
  return (
    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
}

function CoffeeIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/></svg>;
}

function MovieIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>;
}

function DesignIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>;
}

const ICON_MAP: Record<string, React.FC> = {
  coffee: CoffeeIcon,
  movie: MovieIcon,
  design: DesignIcon,
};

function CloseSmall() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

function AddSmall() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
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

interface InterestsProps {
  interests: InterestTag[];
  isEditing: boolean;
  onToggleEdit: () => void;
  onRemove: (id: string) => void;
}

export function Interests({ interests, isEditing, onToggleEdit, onRemove }: InterestsProps) {
  return (
    <section className="backdrop-blur-[20px] bg-surface/60 rounded-xl p-6 border border-white/40 shadow-[0_10px_30px_rgba(255,117,140,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-on-surface flex items-center gap-2">
          <GroupIcon />
          Interests
        </h3>
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
      <div className="flex flex-wrap gap-2">
        {interests.map((interest) => {
          const Icon = ICON_MAP[interest.icon];
          return (
            <div
              key={interest.id}
              className="font-mono text-sm tracking-[0.02em] font-medium bg-primary/5 text-primary border border-primary/20 rounded-full px-4 py-1.5 flex items-center gap-1.5"
            >
              {Icon && <Icon />}
              {interest.label}
              {isEditing && (
                <button onClick={() => onRemove(interest.id)} className="ml-1 hover:text-error transition-colors cursor-pointer">
                  <CloseSmall />
                </button>
              )}
            </div>
          );
        })}
        {isEditing && (
          <button className="font-mono text-sm tracking-[0.02em] font-medium bg-surface-container border border-dashed border-outline-variant text-on-surface-variant hover:bg-surface-container-high rounded-full px-4 py-1.5 flex items-center gap-1 transition-colors cursor-pointer">
            <AddSmall />
          </button>
        )}
      </div>
    </section>
  );
}
