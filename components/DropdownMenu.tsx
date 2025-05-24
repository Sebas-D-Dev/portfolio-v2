import React from 'react';
import styled from 'styled-components';

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
    setOpen(false); // Close dropdown after selection
  };

  return (
    <StyledWrapper>
      <label className="main">
        <input
          className="inp"
          type="checkbox"
          checked={open}
          onChange={() => setOpen(!open)}
        />
        <div className="bar">
          <span className="top bar-list" />
          <span className="middle bar-list" />
          <span className="bottom bar-list" />
        </div>
        <section className="menu-container">
          {items.map((item) => (
            <div
              className="menu-list"
              key={item}
              onClick={() => handleSelect(item)}
              tabIndex={0}
              role="button"
              style={{ cursor: onSelect ? 'pointer' : 'default' }}
            >
              {item}
            </div>
          ))}
        </section>
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .main > .inp {
    display: none;
  }
  .main {
    font-weight: 800;
    color: white;
    background-color: darkviolet;
    padding: 3px 8px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    height: 2.5rem;
    width: 3rem;
    position: relative;
    cursor: pointer;
    justify-content: center;
  }

  /* Remove arrow styles if not needed, or leave as is */

  .bar {
    display: flex;
    height: 50%;
    width: 20px;
    flex-direction: column;
    gap: 3px;
  }

  .bar-list {
    display: block;
    width: 100%;
    height: 3px;
    border-radius: 50px;
    background-color: white;
    transition: background-color 0.4s;
    position: relative;
    /* Remove transform and opacity transitions */
  }

  /* Remove hamburger-to-X animation by commenting out or deleting these: */
  /*
  .inp:not(:checked) ~ .bar > .top {
    transform-origin: top right;
    transform: translateY(var(--transform)) rotate(-45deg);
  }
  .inp:not(:checked) ~ .bar > .middle {
    transform: translateX(-50%);
    opacity: 0;
  }
  .inp:not(:checked) ~ .bar > .bottom {
    transform-origin: bottom right;
    transform: translateY(calc(var(--transform) * -1)) rotate(45deg);
  }
  */

  .menu-container {
    background-color: white;
    color: darkviolet;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 130%;
    transform: translateX(-50%);
    overflow: visible;
    clip-path: inset(0% 100% 0% 100% round 10px); /* hidden by default */
    transition: all 0.4s, box-shadow 0.3s;
    box-sizing: border-box;
    width: max-content;
    min-width: 100%;
    z-index: 1000;
    box-shadow: none;
  }

  .inp:checked ~ .menu-container {
    clip-path: inset(0% 0% 0% 0% round 10px); /* fully visible when checked */
    box-shadow: 0 0 16px 4px rgba(148, 0, 211, 0.4); /* Purple glow */
  }

  .menu-list {
    --delay: 0.4s;
    --trdelay: 0.15s;
    padding: 8px 10px;
    border-radius: inherit;
    transition: background-color 0.2s 0s;
    position: relative;
    transform: translateY(30px);
    opacity: 0;
  }

  .menu-list::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    height: 1px;
    background-color: rgba(0, 0, 0, 0.3);
    width: 95%;
  }

  .menu-list:hover {
    background-color: rgb(223, 223, 223);
  }

  .inp:checked ~ .menu-container .menu-list {
    transform: translateY(0);
    opacity: 1;
  }

  .inp:not(:checked) ~ .menu-container .menu-list {
    transform: translateY(30px);
    opacity: 0;
  }

  .inp:not(:checked) ~ .menu-container .menu-list:nth-child(1) {
    transition:
      transform 0.4s var(--delay),
      opacity 0.4s var(--delay);
  }

  .inp:not(:checked) ~ .menu-container .menu-list:nth-child(2) {
    transition:
      transform 0.4s calc(var(--delay) + (var(--trdelay) * 1)),
      opacity 0.4s calc(var(--delay) + (var(--trdelay) * 1));
  }

  .inp:not(:checked) ~ .menu-container .menu-list:nth-child(3) {
    transition:
      transform 0.4s calc(var(--delay) + (var(--trdelay) * 2)),
      opacity 0.4s calc(var(--delay) + (var(--trdelay) * 2));
  }

  .inp:not(:checked) ~ .menu-container .menu-list:nth-child(4) {
    transition:
      transform 0.4s calc(var(--delay) + (var(--trdelay) * 3)),
      opacity 0.4s calc(var(--delay) + (var(--trdelay) * 3));
  }

  .bar-inp {
    -webkit-appearance: none;
    display: none;
    visibility: hidden;
  }
`;

export default DropdownMenu;