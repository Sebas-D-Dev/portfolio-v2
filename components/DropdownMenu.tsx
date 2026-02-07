import React from 'react';
import styles from './DropdownMenu.module.css';

type DropdownMenuProps = {
  label?: string;
  items: string[];
  onSelect?: (item: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  onSelect,
  open,
  setOpen,
}) => {
  const handleSelect = (item: string) => {
    onSelect?.(item);
    setOpen(false);
  };

  return (
    <div className={styles['dropdown-menu']}>
      <label className="relative flex h-10 w-12 cursor-pointer items-center justify-center rounded-lg bg-primary-600 px-2 py-1 font-bold text-white hover:bg-primary-700 transition-colors">
        <input
          className={styles['menu-checkbox']}
          type="checkbox"
          checked={open}
          onChange={() => setOpen(!open)}
        />
        <div className={styles['hamburger-container']}>
          <span className={styles['bar-line']} />
          <span className={styles['bar-line']} />
          <span className={styles['bar-line']} />
        </div>
        <section
          className={`${styles['menu-container']} absolute left-1/2 top-[130%] z-1000 min-w-full w-max -translate-x-1/2 rounded-lg bg-dark-900/95 backdrop-blur-lg text-white shadow-glow-blue border border-primary-500/20`}
        >
          {items.map((item) => (
            <div
              className={`${styles['menu-item']} relative cursor-pointer rounded-lg px-3 py-2 transition-colors hover:bg-dark-700/60 hover:text-primary-400`}
              key={item}
              onClick={() => handleSelect(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(item);
                }
              }}
              tabIndex={0}
              role="button"
            >
              {item}
            </div>
          ))}
        </section>
      </label>
    </div>
  );
};

export default DropdownMenu;