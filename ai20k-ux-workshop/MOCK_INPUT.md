# 📝 New Researcher MVP — Demo Mock Inputs

Use this document to copy and paste inputs during your demo. These topics are pre-configured in the server's backend seed data to provide rich, immediate, and high-fidelity mock results.

---

## 🎓 Scenario 1: Sleep Duration vs. Academic Performance (Recommended)
*Perfect for illustrating a student-centric research journey.*

### 1. Landing Page Prompt
**Paste this into the main research prompt:**
```text
How does sleep duration and sleep quality affect the academic performance and GPA of university students?
```

### 2. Socratic Clarification Answers
**Paste these answers to the agent's follow-up questions:**
```text
I want to focus on undergraduate students during high-stress exam periods, comparing self-reported sleep diaries with their final term GPAs.
```

### 3. Dialog Simulation History
* **Step 1: User Prompt**
  * **User**: `How does sleep duration and sleep quality affect the academic performance and GPA of university students?`
  * **Agent**:
    > Nice—this is a good starting idea, but it’s still too broad to search and test directly. Let’s narrow it with 3 quick decisions so we can move to Step 2 (a precise, answerable research question):
    1) Which GPA outcome will you use: term GPA (that semester) or final cumulative GPA (end of term)?
    2) How will you measure sleep during the high-stress period: daily sleep diaries (e.g., average over the 2-week finals block) or a single retrospective survey (e.g., “usual sleep”)?
    3) Which student group will you focus on: all undergraduates, or a subset (e.g., full-time students, only first-years, exclude graduate/part-time)?
    Reply with short choices (e.g., “term GPA; diary averages across finals; full-time undergrads”). Then I’ll convert your topic into a single tight topic statement and we’ll draft your research question for Step 2.
    💡 Do you want term GPA or final cumulative GPA as your outcome?
    💡 Will sleep come from diary averages during finals or a general retrospective measure?
    💡 Should the sample be full-time undergrads only, or include part-time/grad students?
* **Step 2: User Prompt**
  * **User**: `I want to focus on undergraduate students during high-stress exam periods, comparing self-reported sleep diaries with their final term GPAs.`
  * **Agent**:
    > Great—this is now much closer to a researchable scope. To complete Step 1 (clarify_topic), I need 2–3 final boundary decisions:
    1) Timing of the sleep measure: Will the sleep diary cover the 2-week finals block only, or a longer window (e.g., 4 weeks including pre-finals)?
    2) Sleep quality definition: Is “sleep quality” from the diary a single daily rating (1–10), or do you also want outcomes like sleep efficiency / number of awakenings?
    3) Study design/analysis choice: Do you plan to analyze as within-person (same students across days) or between-person (correlate each student’s diary averages with GPA)?
    Reply with short choices (e.g., “2-week finals only; 1–10 daily quality only; between-person correlation using averages”). Then I’ll convert your topic into a one-sentence topic statement for Step 2 (define_problem).
    💡 Should the diary cover only the 2-week finals block, or also pre-finals weeks?
    💡 Do we use only the daily 1–10 sleep quality rating, or add other quality indicators?
    💡 Will you test averages vs GPA (between-person) or model day-to-day changes (within-person)?
* **Step 3: User Prompt**
  * **User**: `We will define the exam period as the two-week final examination block at the end of the semester. For sleep diary variables, we'll look at average nightly sleep duration (in hours) and self-reported sleep quality rated daily on a 1-to-10 scale.`
  * **Agent**:
    > Good—your timing and sleep measures are now concrete. For Step 1, I just need 2–3 final choices to make the topic statement unambiguous:
    1) GPA outcome: Will you use term GPA for that semester (most direct) or final cumulative GPA?
    2) Diary-to-GPA approach: Will you relate GPA to between-person averages (each student’s mean sleep duration/quality over the 2 weeks) or do you want a within-person model (daily variations mapped to daily/weekly performance—though GPA is usually not daily)?
    3) Controls (pick at least 2): Which confounders will you control for? Common options: prior GPA (baseline), study hours/workload during the term/exam block, course load/credits, exam difficulty, mental health/anxiety.
    Once you answer these, I’ll produce a single tight topic statement (1 sentence) that we’ll convert into a precise research question in Step 2.
    💡 Which GPA outcome will you use: term GPA or final cumulative GPA?
    💡 Will you link GPA to each student’s 2-week averages (between-person) or a within-person model?
    💡 Which 2+ confounders will you control for (e.g., prior GPA, study hours, course load, anxiety)?

## 🌾 Scenario 2: Climate Change vs. Crop Yields
*Ideal for environmental science or agricultural study domains.*

### 1. Landing Page Prompt
**Paste this into the main research prompt:**
```text
What is the impact of climate change on crop yield, specifically for rice farming in Southeast Asian countries?
```

### 2. Socratic Clarification Answers
**Paste these answers to the agent's follow-up questions:**
```text
I am focusing on the Mekong Delta region in Vietnam, specifically looking at how rising soil salinity and flood events affect seasonal crop cycles.
```

---

## 🧬 Scenario 3: Machine Learning in Healthcare
*Great for showing computer science or clinical predictive modeling applications.*

### 1. Landing Page Prompt
**Paste this into the main research prompt:**
```text
How can machine learning be used for the early diagnosis of Type 2 diabetes in patients using electronic health records (EHR)?
```

### 2. Socratic Clarification Answers
**Paste these answers to the agent's follow-up questions:**
```text
I plan to compare Random Forests and Deep Neural Networks using clinical datasets with demographic and lab test results.
```

---

## 📱 Scenario 4: Social Media vs. Adolescent Mental Health
*Great for psychology or behavioral science demonstrations.*

### 1. Landing Page Prompt
**Paste this into the main research prompt:**
```text
Does active Instagram usage increase anxiety levels in adolescents?
```

### 2. Socratic Clarification Answers
**Paste these answers to the agent's follow-up questions:**
```text
I want to study adolescents aged 13-18, evaluating passive scrolling versus active posting, measured using standard clinical anxiety scales.
```
