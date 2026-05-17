export interface ConnectionData {
  name: string;
  handle: string;
  imageSrc: string;
  isVerified: boolean;
  codeSnippet: string[];
  glowPosition: "right" | "left";
  rotation: "rotate-3" | "-rotate-2";
}

export const CONNECTIONS: ConnectionData[] = [
  {
    name: "Alex Chen",
    handle: "@frontend_poet",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAaUA6WIFFGVdmgYR_Pt7wn3sucZFWYQ10JpGVy00Jx8wimDNhulg-FcNQOHsvFhUy6sLMotA-VqwI6gEDTrVx4AchIvygo7VBFwAz3uiEjuqZ6u0RgdbtGaFv5wasHR9YSZ96b_poWN5x_jO8QzTF4zBlEIQ76-YUo3TqejgNCUwCrPtuY8MRxedq12anTHzS0K08n5_ZVGfJ7PhF1qUe0Fd0b6BbXv5KnQr9aFTAjNK_6wRw5Tq-lfpo4WZAGg70ihYyHjUmFkQDJ",
    isVerified: true,
    codeSnippet: [
      'if (coffee === empty) {',
      '  await fetch("date");',
      '}',
    ],
    glowPosition: "right",
    rotation: "rotate-3",
  },
  {
    name: "Sam Rivera",
    handle: "@data_dreamer",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAP5SBqAJZUoYI9vBCVk3g3rTPEK9OiY0z7ZrWdUNcUCI-Ku3X3y8bq0_Uwpwq3CHzGNeYCduGzJ2TUSGwOnP9NZJaPio01_F6F7XQXM2vfRxfX3iLCCeJC64utp_98EHjYjBBZuKgUrWrshLcaM5724rwXv1Wt15g0LxuwNjULBMHa1kZeic2Cp4l1OMr2iLXyWSDc1s1UbTK2kz6fyo2BSCVMG70sf-qAsIyyL2PizZRPzSaAi5sPwY4EwzIxRra77isQtr0iF59_",
    isVerified: false,
    codeSnippet: [
      '<span class="text-secondary">SELECT</span> heart',
      '<span class="text-secondary">FROM</span> universe',
      '<span class="text-secondary">WHERE</span> soulmate = true;',
    ],
    glowPosition: "left",
    rotation: "-rotate-2",
  },
];
