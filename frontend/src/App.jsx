import { useMemo, useState } from "react"
import "./App.css"

const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Bills",
  "Health",
  "Other"
]

const categoryClass = {
  Food: "cat-food",
  Transport: "cat-transport",
  Entertainment: "cat-entertainment",
  Shopping: "cat-shopping",
  Bills: "cat-bills",
  Health: "cat-health",
  Other: "cat-other"
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2
})

export function Card() {
  const [expenses, setExpenses] = useState([])
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Food")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [searchText, setSearchText] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [budget, setBudget] = useState(2000)
  const [showForm, setShowForm] = useState(true)

  const addExpense = (event) => {
    event.preventDefault()

    const parsedAmount = Number.parseFloat(amount)
    if (!title.trim() || !date || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid title, amount, and date.")
      return
    }

    const newExpense = {
      id: Date.now(),
      title: title.trim(),
      amount: parsedAmount,
      category,
      date
    }

    setExpenses((prev) => [newExpense, ...prev])
    setTitle("")
    setAmount("")
    setCategory("Food")
    setDate(new Date().toISOString().split("T")[0])
  }

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch = expense.title.toLowerCase().includes(searchText.toLowerCase())
      const matchesCategory = activeCategory === "All" || expense.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [expenses, searchText, activeCategory])

  const sortedExpenses = useMemo(() => {
    const list = [...filteredExpenses]

    if (sortBy === "amount-high") {
      list.sort((a, b) => b.amount - a.amount)
    } else if (sortBy === "amount-low") {
      list.sort((a, b) => a.amount - b.amount)
    } else if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else {
      list.sort((a, b) => new Date(b.date) - new Date(a.date))
    }

    return list
  }, [filteredExpenses, sortBy])

  const groupedExpenses = useMemo(() => {
    return sortedExpenses.reduce((acc, expense) => {
      const monthKey = new Date(expense.date).toLocaleString("en-US", {
        month: "long",
        year: "numeric"
      })

      if (!acc[monthKey]) {
        acc[monthKey] = []
      }

      acc[monthKey].push(expense)
      return acc
    }, {})
  }, [sortedExpenses])

  const groupedKeys = Object.keys(groupedExpenses).sort((a, b) => new Date(b) - new Date(a))

  const totalSpent = useMemo(() => expenses.reduce((sum, expense) => sum + expense.amount, 0), [expenses])
  const remainingBudget = budget - totalSpent
  const progressPercent = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0

  const topCategory = useMemo(() => {
    if (!expenses.length) {
      return "None"
    }

    const totals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {})

    return Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0]
  }, [expenses])

  const currentMonthSpend = useMemo(() => {
    const now = new Date()
    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date)
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        )
      })
      .reduce((sum, expense) => sum + expense.amount, 0)
  }, [expenses])

  const monthName = new Date().toLocaleString("en-US", { month: "long" })

  return (
    <div className="expense-app-shell">
      <div className="expense-app-bg" aria-hidden="true" />
      <div className="expense-tracker">
        <header className="hero">
          <div>
            <p className="eyebrow">Expense dashboard</p>
            <h1>Track every rupee with clarity</h1>
            <p className="subtitle">Use filters, sort options, and budget tracking to stay in control.</p>
          </div>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "Hide form" : "Show form"}
          </button>
        </header>

        <section className="stats-grid">
          <article className="stat-card">
            <span>Total spent</span>
            <strong>{inr.format(totalSpent)}</strong>
          </article>
          <article className="stat-card">
            <span>{monthName} spend</span>
            <strong>{inr.format(currentMonthSpend)}</strong>
          </article>
          <article className="stat-card">
            <span>Top category</span>
            <strong>{topCategory}</strong>
          </article>
        </section>

        <section className="budget-card">
          <div className="budget-head">
            <h2>Budget progress</h2>
            <p className={remainingBudget < 0 ? "danger-text" : "safe-text"}>
              Remaining: {inr.format(remainingBudget)}
            </p>
          </div>

          <div className="budget-controls">
            <label htmlFor="budget-range">Set budget</label>
            <input
              id="budget-range"
              type="range"
              min="100"
              max="10000"
              step="100"
              value={budget}
              onChange={(event) => setBudget(Number(event.target.value))}
            />
            <input
              className="budget-input"
              type="number"
              min="0"
              value={budget}
              onChange={(event) => setBudget(Number(event.target.value) || 0)}
            />
          </div>

          <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progressPercent)}>
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </section>

        <section className="content-grid">
          <form className={`add-expense-form ${showForm ? "form-open" : "form-closed"}`} onSubmit={addExpense}>
            <h2>Add new expense</h2>

            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Groceries"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="form-group two-col">
              <div>
                <label htmlFor="amount">Amount</label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="add-btn">Add expense</button>
          </form>

          <section className="expenses-panel">
            <div className="toolbar">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="amount-high">Amount high to low</option>
                <option value="amount-low">Amount low to high</option>
              </select>
            </div>

            <div className="chip-row">
              {["All", ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`chip ${activeCategory === cat ? "chip-active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {sortedExpenses.length === 0 ? (
              <p className="no-expenses">No matching expenses yet.</p>
            ) : (
              <div className="monthly-groups">
                {groupedKeys.map((monthKey) => {
                  const monthExpenses = groupedExpenses[monthKey]
                  const monthTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

                  return (
                    <article key={monthKey} className="month-group">
                      <header className="month-header">
                        <h3>{monthKey}</h3>
                        <span>{inr.format(monthTotal)}</span>
                      </header>
                      <ul className="month-expenses">
                        {monthExpenses.map((expense) => (
                          <li key={expense.id} className="expense-item">
                            <div className="expense-main">
                              <p className="expense-title">{expense.title}</p>
                              <span className={`expense-category ${categoryClass[expense.category] || "cat-other"}`}>
                                {expense.category}
                              </span>
                            </div>
                            <div className="expense-meta">
                              <time>{new Date(expense.date).toLocaleDateString("en-US")}</time>
                              <strong>{inr.format(expense.amount)}</strong>
                              <button type="button" className="delete-btn" onClick={() => deleteExpense(expense.id)}>
                                Remove
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </section>
      </div>
    </div>
  )
}
