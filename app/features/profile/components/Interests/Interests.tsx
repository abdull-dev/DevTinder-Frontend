"use client";

import type { InterestTag } from "../../../../lib/types";
import { ALL_INTERESTS } from "../../../../lib/interests";

function GroupIcon() {
  return (
    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
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
  onAdd?: (label: string) => void;
}

export function Interests({ interests, isEditing, onToggleEdit, onRemove, onAdd }: InterestsProps) {
  const selectedLabels = new Set(interests.map((i) => i.label));

  const handleToggle = (label: string) => {
    if (selectedLabels.has(label)) {
      const interest = interests.find((i) => i.label === label);
      if (interest) onRemove(interest.id);
    } else {
      onAdd?.(label);
    }
  };

  return (
    <section className="backdrop-blur-[20px] bg-surface/60 rounded-xl p-6 border border-white/40 shadow-[0_10px_30px_rgba(255,117,140,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-on-surface flex items-center gap-2">
          <GroupIcon />
          Interests
          {isEditing && (
            <span className="text-primary font-mono text-xs font-normal">
              ({interests.length} selected)
            </span>
          )}
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

      {/* View mode — show only selected */}
      {!isEditing && (
        <div className="flex flex-wrap gap-2">
          {interests.length === 0 && (
            <p className="text-on-surface-variant/50 font-mono text-sm">No interests selected</p>
          )}
          {interests.map((interest) => (
            <div
              key={interest.id}
              className="font-mono text-sm tracking-[0.02em] font-medium bg-primary/5 text-primary border border-primary/20 rounded-full px-4 py-1.5"
            >
              {interest.label}
            </div>
          ))}
        </div>
      )}

      {/* Edit mode — show all interests as toggleable chips */}
      {isEditing && (
        <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
          {ALL_INTERESTS.map((label: string) => {
            const selected = selectedLabels.has(label);
            return (
              <button
                key={label}
                onClick={() => handleToggle(label)}
                className={`font-mono text-sm tracking-[0.02em] font-medium rounded-full px-4 py-1.5 transition-all cursor-pointer ${
                  selected
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:text-primary"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
