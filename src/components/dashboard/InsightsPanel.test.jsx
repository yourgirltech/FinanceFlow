import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InsightsPanel from './InsightsPanel'

const insights = [
  { id: 'trend', icon: '📈', label: 'Spotted a trend', text: 'Your dining expenses increased by 40% this month.', tone: 'down' },
  { id: 'top-category', icon: '🏆', label: 'Biggest expense', text: 'Food & Dining was your biggest expense.', tone: 'neutral' },
  { id: 'recurring', icon: '🔁', label: 'Recurring charges', text: 'You have 2 recurring charges averaging $30/month.', tone: 'neutral' },
]

describe('InsightsPanel', () => {
  it('shows an empty-state message when there are no insights', () => {
    render(<InsightsPanel insights={[]} goal={null} onEditGoal={() => {}} />)
    expect(screen.getByText(/add a few transactions/i)).toBeInTheDocument()
  })

  it('renders each insight up to maxCount', () => {
    render(<InsightsPanel insights={insights} goal={null} onEditGoal={() => {}} maxCount={2} />)

    expect(screen.getByText('Your dining expenses increased by 40% this month.')).toBeInTheDocument()
    expect(screen.getByText('Food & Dining was your biggest expense.')).toBeInTheDocument()
    expect(screen.queryByText('You have 2 recurring charges averaging $30/month.')).not.toBeInTheDocument()
  })

  it('shows a "set a savings goal" prompt when no goal is set, and calls onEditGoal when clicked', async () => {
    const onEditGoal = vi.fn()
    const user = userEvent.setup()
    render(<InsightsPanel insights={insights} goal={null} onEditGoal={onEditGoal} />)

    const button = screen.getByText(/set a savings goal/i)
    await user.click(button)
    expect(onEditGoal).toHaveBeenCalledTimes(1)
  })

  it('shows the goal name when a goal is set', () => {
    render(<InsightsPanel insights={insights} goal={{ name: 'New laptop', amount: 1500 }} onEditGoal={() => {}} />)
    expect(screen.getByText(/new laptop/i)).toBeInTheDocument()
  })
})
