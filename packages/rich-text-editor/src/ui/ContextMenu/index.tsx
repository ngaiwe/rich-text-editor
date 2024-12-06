import './index.less'

import ContextMenuOption from '../../plugins/ContextMenuPlugin/ContextMemuOption'
import {addClassName} from '../../utils/className'

export function ContextMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number
  isSelected: boolean
  onClick: () => void
  onMouseEnter: () => void
  option: ContextMenuOption
}) {
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={isSelected ? 'item selected' : 'item'}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={`typeahead-item-${index}`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <span className="text">{option.title}</span>
    </li>
  )
}

export function ContextMenu({
  options,
  selectedItemIndex,
  onOptionClick,
  onOptionMouseEnter,
}: {
  selectedItemIndex: number | null
  onOptionClick: (option: ContextMenuOption, index: number) => void
  onOptionMouseEnter: (index: number) => void
  options: ContextMenuOption[]
}) {
  return (
    <div className={addClassName(['typeahead-popover'])}>
      <ul>
        {options.map((option: ContextMenuOption, i: number) => (
          <ContextMenuItem
            index={i}
            isSelected={selectedItemIndex === i}
            onClick={() => onOptionClick(option, i)}
            onMouseEnter={() => onOptionMouseEnter(i)}
            key={option.key}
            option={option}
          />
        ))}
      </ul>
    </div>
  )
}
