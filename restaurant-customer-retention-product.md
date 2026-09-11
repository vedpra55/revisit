# Restaurant Customer Retention Product

## 1. Product Summary

A lightweight customer-retention layer for independent cafés and restaurants.

The product does **not** replace the restaurant's billing/POS software. Staff continue using the billing system they already use.

The product adds one very small workflow at the counter:

1. Search an existing customer's phone number, or create a new customer with a phone number and optional name.
2. Before billing, see whether that customer has a reward available.
3. Apply the reward in the existing POS.
4. Take a photo of the final bill.
5. OCR reads the bill and automatically stores the customer's visit and order history.
6. The system learns customer behavior and decides which customers should receive a reward, referral opportunity, or review request.

The goal is simple:

> **Help restaurants bring existing customers back more often, without making staff or customers use a complicated new system.**

---

# 2. The Problem

Restaurants spend significant effort getting customers through the door, but much less effort understanding what happens after the first visit.

A typical independent café may know:

- Total daily sales
- Best-selling items
- Busy hours
- Number of bills

But the owner often does not know:

- Who their regular customers are
- How frequently each customer normally visits
- Which customers are starting to disappear
- Which customers spend the most over time
- What each regular customer usually orders
- When a customer is likely to come back
- Who is worth rewarding
- Which customers can bring new customers through referrals
- Which happy customers should be asked for a Google review

The result is that restaurants often treat every customer the same.

The product changes that by turning individual bills into a growing customer relationship.

---

# 3. Product Thesis

The product is built around one idea:

> **The restaurant already paid to acquire the customer. The next opportunity is getting that customer to return.**

Instead of becoming another restaurant operating system, the product acts as a small intelligence and retention layer on top of the restaurant's existing workflow.

The customer does not need to:

- Download an app
- Create an account
- Scan a QR
- Fill in a form
- Remember a loyalty card

The staff does not need to:

- Replace the POS
- Manually maintain a CRM
- Enter every item into a new system
- Create campaigns every day
- Analyze customer spreadsheets

The product should do most of the work automatically.

---

# 4. Product Positioning

## Core positioning

> **Bring your customers back. Automatically.**

Alternative positioning:

> **Know your regulars. Reward them before they disappear.**

> **Your restaurant already has customers. We help them come back.**

The product should not lead with:

- AI restaurant management
- Inventory management
- Restaurant ERP
- Generic CRM
- Analytics dashboard

Those descriptions make the product sound broader and harder to understand.

The strongest positioning is customer retention and repeat revenue.

---

# 5. Target Customer

## Initial target

Independent:

- Cafés
- QSRs
- Casual restaurants
- Dessert shops
- Bakeries
- Small food chains

Best initial fit:

- 1–5 outlets
- Meaningful daily transaction volume
- Existing billing/POS software
- Owner or manager directly involved in operations
- Wants more repeat customers
- Does not want a complicated enterprise system

## Avoid initially

Large restaurant chains with complex enterprise technology stacks.

Very small businesses with too few transactions to produce useful customer behavior.

Restaurants that already have a deeply integrated and mature retention operation.

---

# 6. The Core Customer Flow

## Step 1 — Customer arrives

Customer orders normally.

Nothing changes for the customer.

---

## Step 2 — Staff enters phone number

At billing, staff asks:

> "Phone number?"

Staff searches the number in the product.

### Existing customer

The profile appears immediately.

Example:

```text
Rahul Sharma

8 visits
₹4,280 total spend
Usual visit gap: 8.7 days
Last visit: 9 days ago

Reward available:
₹100 OFF
Minimum bill ₹350

[ APPLY REWARD ]
```

The staff can apply the reward in the restaurant's normal billing software.

No POS replacement.

---

## Step 3 — New customer

If the number does not exist:

```text
98xxxxxx21

Name: Rahul
```

Name can be optional.

The system creates a customer profile.

There is no long registration process.

---

## Step 4 — Billing happens normally

Staff uses the existing POS exactly as before.

The product is not responsible for issuing the bill.

---

## Step 5 — Staff photographs the bill

After the bill is generated:

> Take photo → OCR → Save

The product extracts:

- Bill amount
- Items
- Quantity where available
- Date
- Time
- Bill number where available

The transaction is attached to the customer.

Example:

```text
Customer: Rahul Sharma

Visit #8
Friday, 7:32 PM

Cold Coffee
Paneer Wrap

Bill total: ₹420
Reward: ₹100
Final bill: ₹320
```

---

# 7. Why Bill-Photo OCR Is Important

The product should initially avoid trying to integrate with every POS system.

That would create:

- Technical complexity
- Different APIs
- Different permissions
- Different data formats
- Long onboarding cycles
- POS-specific maintenance

Instead:

> **The POS remains the source of billing. The receipt becomes the bridge into our system.**

This allows the product to work alongside many different billing systems.

The restaurant does not need to change its existing POS.

---

# 8. Customer Profile

Every customer gradually builds a lightweight profile.

Example:

```text
Rahul Sharma
Customer ID: C-00284

Visits: 8
Total spend: ₹4,280
Average bill: ₹535

Last visit: 12 Sep
Usual visit gap: 8.7 days

Preferred time:
Friday/Saturday
6 PM–9 PM

Frequent items:
Cold Coffee
Paneer Wrap

Customer status:
Regular

Current reward:
₹100 off
```

The profile should become more useful automatically as more bills are captured.

---

# 9. Product Feature 1 — Capture

## Goal

Turn anonymous transactions into recognizable customer history.

## Inputs

- Phone number
- Optional name
- Bill photo

## Outputs

- Customer profile
- Visit history
- Purchase history
- Spend history
- Visit frequency
- Favorite items
- Last visit
- Average bill

## Staff effort

Target:

> **10–15 seconds or less per existing customer.**

The workflow should feel like a tiny extension of billing, not a new administrative task.

---

# 10. Product Feature 2 — Timed Rewards

This is the first major retention engine.

The system observes each customer's normal visit pattern.

Example:

```text
Customer usually visits every 8–10 days.

Last visit:
10 days ago

Current risk:
Increasing

Recommended action:
Small reward
```

The reward should become available **before billing**.

When the customer comes back and the staff searches their number:

```text
RAHUL SHARMA

REGULAR CUSTOMER

₹100 REWARD AVAILABLE

[ APPLY ]
```

The restaurant decides the actual reward structure.

Examples:

- ₹50 off
- ₹100 off
- Free add-on
- Free coffee
- Dessert
- 10% off
- Conditional reward above a minimum bill

The restaurant can configure guardrails:

```text
Minimum bill: ₹350
Reward frequency: once every 14 days
Cannot combine with another offer
Expiry: 7 days
```

The system's job is to decide **who should receive a reward and when**.

---

# 11. Why Timed Rewards Matter

A generic loyalty system says:

> "You earned 100 points."

This product should say:

> "Rahul normally comes every 9 days. It has been 12. Give him ₹100 today."

The product should optimize for:

> **return behavior**

rather than:

> **points accumulation**

---

# 12. Product Feature 3 — Referral

Once a customer is clearly a regular, the system can activate them as an acquisition channel.

Example:

```text
Rahul

Visits: 8
Spend: ₹4,280
Customer status: VIP

Referral ready

Invite a friend.
Both receive ₹100.
```

A simple referral code/link can be attached to the customer.

When a new customer comes through that referral:

```text
Rahul → Friend → New customer

Referral reward triggered
```

The owner can then see:

```text
14 referred customers this month
₹6,400 revenue from referrals
```

The goal is to turn loyal customers into a low-cost source of new customers.

---

# 13. Product Feature 4 — Reviews

Reviews should also be behavior-triggered rather than broadcast to everybody.

The system can identify customers with strong repeat behavior.

Example:

```text
Rahul

8 visits
High repeat rate
Recent visit

Review request:
READY
```

The system sends a direct Google review link through an approved communication channel.

This creates a path:

```text
Happy repeat customer
        ↓
Review request
        ↓
Google review
        ↓
More local visibility
        ↓
New customers
```

The restaurant should not ask every customer for a review. Timing and customer quality matter.

---

# 14. Product Feature 5 — AI Customer Brain

This is the main AI component.

AI should not be the entire product.

It should be the decision layer that answers:

> **Who should the restaurant act on today?**

For each customer, the system can evaluate:

- Visit frequency
- Days since last visit
- Average visit interval
- Spend
- Purchase behavior
- Favorite products
- Customer value
- Recent reward history
- Referral history
- Review eligibility
- Time/day patterns

The system then selects an action.

Example:

```text
Customer:
Rahul

Observed:
Normally visits every 8.7 days
Last visit: 12 days ago
High average spend
Frequently orders Cold Coffee

AI recommendation:
Win-back reward

Offer:
₹100 Cold Coffee reward

Best timing:
Friday, 6–8 PM
```

---

# 15. AI Output

The AI should produce a simple action list for the owner, not a paragraph of analysis.

Example:

```text
TODAY'S RETENTION QUEUE (MANUAL SEND)

1. Rahul Sharma (+91 98xxxxxx21)
   • Action: Win-back offer
   • Offer: ₹100 off Cold Coffee (min bill ₹350)
   • Best time to send: Friday, 6:00 PM (usual visiting time)
   • AI Message: "Hey Rahul 👋 Missing your usual Friday Cold Coffee? We've saved ₹100 off for you this weekend. Drop in before Sunday!"
   [ Open WhatsApp ] [ Copy Message ]

2. Priya Patel (+91 98xxxxxx55)
   • Action: VIP Appreciation / Referral
   • Offer: Bring a friend, both get 15% off
   • Best time to send: Saturday, 1:00 PM
   • AI Message: "Hey Priya, you're one of our top regulars! Bring a friend this weekend and enjoy 15% off for both of you."
   [ Open WhatsApp ] [ Copy Message ]
```

The owner does not need to interpret a dashboard.

The product tells them exactly who to message, what to offer, what to say, and when to send it.

---

# 16. What AI Should and Should Not Do

## AI should do

- Select the best customers to target each day
- Choose the appropriate retention action (win-back, VIP reward, referral, review)
- Recommend reward intensity based on spend history
- Personalize offers using favorite items
- Determine optimal day and time to send (based on customer visit patterns)
- Auto-write natural, warm WhatsApp copy tailored to the profile
- Explain why an action is recommended

## What is NOT done (Deliberate Design Decision)

- **No automated WhatsApp Cloud API:** The owner sends messages manually.
- No third-party WhatsApp bot integrations or Meta template approval nightmares.
- No per-conversation API utility fees charged to restaurants.
- The human owner stays 100% in control: messages come directly from the owner/café's own number, guaranteeing authentic delivery and zero risk of automated bans.

## Normal backend logic should do

- Customer matching
- Bill parsing validation
- Visit frequency calculations
- Spending calculations
- Reward eligibility & guardrails
- Frequency limits (e.g., max 1 outreach per customer per 14 days)
- Revenue attribution
- Database operations

Do not use an LLM for deterministic calculations.

Use AI where judgment, personalization, and copywriting are needed.

---

# 17. Messaging — Manual WhatsApp, AI-Drafted

The system deliberately avoids automated WhatsApp API bots.

Instead, it functions as a **Personal Retention Copilot for the Owner**:

```text
AI Analyzes Customer History
             ↓
AI selects: Target Number + Custom Offer + Best Time + Drafts Message
             ↓
Owner opens daily queue on phone or desktop
             ↓
Taps [ Open WhatsApp ] (pre-fills message via wa.me link)
             ↓
Owner sends manually in 2 seconds from their own WhatsApp
```

### Why this is superior for independent restaurants:

1. **Zero Setup & Zero Extra Cost:** No WhatsApp Business API fees, no Meta business verification, no pre-approved templates.
2. **Authentic Relationship:** The message arrives directly from the restaurant owner / counter number, not a generic marketing bot.
3. **Owner Stays in Control:** The owner can inspect the message, tweak the wording if desired, and verify before sending.
4. **Optimized Send Time:** The AI tells the owner *when* to send (e.g., *"Friday 6:00 PM"*), matching the customer's historical visit habits.

---

# 18. Restaurant Insights

Insights should exist, but they should be secondary to action.

Examples:

```text
Your busiest hour:
7–8 PM

Top item:
Cold Coffee

Average bill:
₹438

Repeat customer rate:
31%

Customers at risk:
86

VIP customers:
24
```

More useful versions convert data into actions.

Instead of:

> "Saturday 7–9 PM is busy."

Show:

> **Saturday 7–9 PM is 34% busier than Friday. Consider adding one extra staff member.**

Instead of:

> "Cold Coffee is popular."

Show:

> **Cold Coffee buyers return more frequently than average. Consider using it in win-back offers.**

The principle:

> **Insight → recommendation → action**

---

# 19. The Daily Owner Experience

The owner should not need to log in constantly.

The ideal product can send a daily summary.

Example:

```text
GOOD MORNING — CAFÉ PALM

Yesterday
Revenue: ₹42,800

Customer activity
43 new customers
81 repeat customers

Today's actions
14 customers need a nudge
8 rewards are available
5 customers are referral-ready
3 review requests are ready

Yesterday's retention impact
31 customers returned
₹18,740 attributed repeat revenue
```

The product becomes a daily operating assistant rather than another dashboard.

---

# 20. Staff Experience

The staff app should have very few screens.

## Screen 1 — Customer Search

```text
Enter phone number

[ 98xxxxxx21 ]
```

## Screen 2 — Customer Result

```text
Rahul Sharma
8 visits
Regular

₹100 reward available

[ APPLY ]
```

## Screen 3 — Bill Capture

```text
Take bill photo

[ CAMERA ]
```

That's essentially the staff workflow.

Everything else should happen in the background.

---

# 21. Onboarding

The product should aim for minimal setup.

## Initial setup

Restaurant provides:

- Restaurant name
- Phone/WhatsApp communication setup
- Google Business profile
- Reward preferences

Then staff installs or opens the small counter app.

No migration project.

No POS replacement.

No customer app.

No training-heavy implementation.

---

# 22. POS Integration Strategy

Do **not** start by building integrations with every POS.

## MVP

Use:

> **Customer phone number + bill photo + OCR**

This allows the product to operate independently of the restaurant's billing software.

## Later

Build integrations based on demand.

Architecture:

```text
                Existing POS systems
                       |
       -------------------------------------
       |                 |                 |
      API              CSV             Receipt
       |                 |                 |
       -----------------+------------------
                         |
                  Data Normalization
                         |
                  Customer Engine
                         |
                    AI Decision Layer
                         |
          -----------------------------
          |            |              |
        Reward      Referral       Review
          |            |              |
                    WhatsApp
```

The product should have one internal data format regardless of where the transaction came from.

---

# 23. Data Model

The basic internal objects are:

## Restaurant

```text
restaurant_id
name
outlet
timezone
reward_rules
communication_settings
```

## Customer

```text
customer_id
restaurant_id
phone
name
first_visit
last_visit
visit_count
total_spend
average_bill
status
```

## Visit

```text
visit_id
customer_id
date
time
bill_amount
items
reward_used
```

## Item

```text
item_id
name
quantity
price
category
```

## Reward

```text
reward_id
customer_id
type
value
minimum_bill
created_at
expires_at
used_at
status
```

## Action

```text
action_id
customer_id
type
reason
recommended_at
executed_at
result
```

---

# 24. Customer Segmentation

The system can maintain simple behavioral states.

```text
NEW
```

First few visits.

```text
REGULAR
```

Consistent repeat behavior.

```text
VIP
```

High frequency and/or high spend.

```text
AT_RISK
```

Customer is past their normal return interval.

```text
LOST
```

Customer has been inactive for a longer period.

These are behavioral states, not fixed labels.

The system should update them continuously.

---

# 25. Revenue Attribution

This is important for proving the product's value.

When the system recommends a reward or campaign, record it.

Example:

```text
Action:
₹100 win-back reward

Customer:
Rahul

Reward sent:
12 Sep

Return:
15 Sep

Bill:
₹540
```

Then the system can show:

```text
Attributed revenue:
₹540
```

Over time:

```text
Campaign cost:
₹3,200

Attributed revenue:
₹18,740
```

The product should eventually answer:

> **"How much additional business did we help create?"**

That is the number the restaurant owner cares about.

---

# 26. Product Loop

The complete system is:

```text
CUSTOMER VISITS
       ↓
PHONE NUMBER
       ↓
CUSTOMER RECOGNIZED
       ↓
REWARD SHOWN BEFORE BILLING
       ↓
BILL CREATED
       ↓
BILL PHOTO
       ↓
OCR
       ↓
CUSTOMER HISTORY UPDATED
       ↓
AI LEARNS BEHAVIOR
       ↓
CUSTOMER BECOMES AT-RISK / VIP / REFERRAL-READY
       ↓
REWARD / REFERRAL / REVIEW ACTION
       ↓
CUSTOMER RETURNS
       ↓
REVENUE TRACKED
       ↓
AI GETS BETTER
```

This is the core product loop.

---

# 27. What the Product Is Not

The product should deliberately avoid becoming:

- POS software
- Accounting software
- Payroll
- KOT management
- Table management
- Inventory management
- Procurement software
- Full ERP
- Generic marketing automation suite

Those can create significant product complexity.

The product should stay focused on:

> **Customer recognition + repeat visits + customer-driven growth**

---

# 28. MVP

The first version should contain only:

### Staff

- Phone search
- New customer creation
- Customer profile
- Reward display
- Reward application confirmation
- Bill photo capture

### Backend

- OCR
- Customer matching
- Visit history
- Item history
- Spend tracking
- Visit frequency
- Reward rules

### AI

- Identify customers at risk
- Recommend reward
- Choose preferred product
- Generate message

### Owner

- Daily manual WhatsApp retention queue (Phone #, AI message, tailored offer, best time to send, 1-tap `[ Open WhatsApp ]`)
- Customers
- Repeat visits
- Rewards issued
- Rewards redeemed
- Basic attributed revenue

Do not build the rest until customers are using and paying for this.

---

# 29. Suggested First Experiment

The goal is not initially to build a huge SaaS company.

The first goal is to answer:

> **Will restaurant owners pay us to increase repeat business?**

Start with a small number of restaurants.

For each restaurant:

1. Install the staff app.
2. Start capturing customers and bills.
3. Build customer histories.
4. Activate rewards.
5. Measure returned customers.
6. Measure resulting revenue.
7. Show the owner the result.
8. Ask them to pay to continue.

The most important metric is not:

> Number of customers captured.

It is:

> **Additional repeat revenue generated.**

---

# 30. Core Metrics

## Product metrics

- Customer profiles created
- Bills captured
- Repeat customers identified
- Reward redemption rate
- Referral conversion
- Review conversion
- Messages sent
- Return rate

## Business metrics

- Incremental repeat visits
- Incremental repeat revenue
- Revenue per retained customer
- Referral revenue
- Review growth
- Cost of rewards
- Return on reward spend

---

# 31. Key Risks

## Staff adoption

If the workflow takes too long, staff will stop using it.

The product must remain extremely fast.

Target:

> Search → reward → bill photo → done.

---

## OCR accuracy

Restaurant receipts have different formats.

OCR must be tested against many receipt layouts.

The system should allow a quick correction when OCR gets something wrong.

---

## Customer phone number quality

Some customers may refuse to provide a phone number.

The product should not make the restaurant dependent on 100% customer capture.

Capture rate is expected to improve as the product proves useful.

---

## Reward economics

Giving discounts to everybody destroys margin.

The system should reward customers selectively.

The goal is:

> **Spend ₹50 to create a ₹400+ repeat visit**

not:

> Discount everyone.

---

## Messaging fatigue

Too many messages will cause customers to ignore or block the restaurant.

The system needs frequency controls.

Example:

```text
Maximum promotional messages:
1 per 14 days
```

---

## False AI recommendations

The AI should be conservative.

A reward should only be recommended when the expected value makes sense.

The system should always maintain business rules around any AI recommendation.

---

# 32. Product Philosophy

The entire product should follow three principles.

### 1. Customer does less

The customer should not have to operate another app.

### 2. Staff does less

The staff should perform only the minimum steps required to connect a bill to a customer.

### 3. Software does more

The system should handle:

- Recognition
- History
- Analysis
- Timing
- Recommendations
- Messaging
- Attribution

The human should mostly approve and execute.

---

# 33. The One-Sentence Product

> **A simple customer-retention layer for cafés and restaurants that recognizes regulars, rewards them at the counter, and uses AI to bring customers back before they disappear.**

---

# 34. The One-Sentence Sales Pitch

> **"You already have customers. We help you get more repeat visits from them without changing your billing software."**

---

# 35. The Ultimate Outcome

The desired transformation is:

### Before

```text
Customer
↓
Bill
↓
Leaves
↓
Restaurant forgets them
```

### After

```text
Customer
↓
Recognized
↓
Visit history remembered
↓
Reward at the right time
↓
Customer returns
↓
Referral
↓
Review
↓
More customers
↓
More repeat revenue
```

The product is ultimately not selling customer profiles, AI, rewards, WhatsApp, or analytics.

It is selling:

> **More repeat customers and more revenue from customers the restaurant already acquired.**
