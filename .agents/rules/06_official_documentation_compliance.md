# অফিশিয়াল ডকুমেন্টেশন অনুসরণ ও জিরো-ডেপ্রিকেশন নীতিমালা (Official Documentation Compliance)

## ১. কোর নীতি (Core Mandate)
কোড লেখার সময় প্রতিটি প্রযুক্তির **লেটেস্ট অফিশিয়াল ডকুমেন্টেশন (Official Docs)** কঠোরভাবে অনুসরণ করতে হবে। ইন্টারনেটের পুরোনো ব্লগ বা মান্ধাতার আমলের ডেপ্রিকেটেড (Deprecated) সিনট্যাক্স ব্যবহার সম্পূর্ণ নিষিদ্ধ।

---

## ২. প্রযুক্তিভিত্তিক অফিশিয়াল ডকুমেন্টেশন স্ট্যান্ডার্ড

### ☕ ১. Java 21 (LTS) & Spring Boot 3.3+ ([docs.spring.io](https://docs.spring.io))
- **Jakarta Namespace**: সম্পূর্ণভাবে `jakarta.*` ব্যবহার করতে হবে (`jakarta.persistence.*`, `jakarta.validation.*`)। পুরোনো `javax.*` সম্পূর্ণ নিষিদ্ধ।
- **Spring Security 6.x**: মেথড চেইনিং এবং `SecurityFilterChain` বিন ব্যবহার করতে হবে। ডেপ্রিকেটেড `WebSecurityConfigurerAdapter` বা পুরোনো কনফিগারেশন নিষিদ্ধ।
- **Java 21 Modern Syntax**:
  - DTO-র জন্য আধুনিক **Java Records** ব্যবহার।
  - টেক্সট ব্লকের জন্য মাল্টি-লাইন স্ট্রিং (`"""`).
  - প্যাটার্ন ম্যাচিং ও সুইচ এক্সপ্রেশন।
  - কোনো ডেপ্রিকেটেড মেথড বা লাইব্রেরি (যেমন পুরানো `java.util.Date`) ব্যবহার করা যাবে না; আধুনিক `java.time.Instant` ও `LocalDate` ব্যবহার করতে হবে।

### ⚛️ ২. React 19 & Modern Hooks ([react.dev](https://react.dev))
- অফিশিয়াল `react.dev` এর আধুনিক ফাংশনাল কম্পোনেন্ট আর্কিটেকচার মেনে কোড লিখতে হবে।
- কোনো ক্লাসিক ক্লাস কম্পোনেন্ট (`class MyComponent extends Component`) লেখা সম্পূর্ণ নিষিদ্ধ।
- সাইড ইফেক্টের জন্য অফিশিয়াল হুক্স (`useEffect`, `useCallback`, `useMemo`) এর সঠিক ডিপেনডেন্সি অ্যারে দিতে হবে।

### 🎨 ৩. Tailwind CSS v4 ([tailwindcss.com](https://tailwindcss.com))
- টেইলউইন্ডের নতুন **v4 ইঞ্জিন** ডকুমেন্টেশন অনুযায়ী আধুনিক সিএসএস ভ্যারিয়েবল ও ইউটিলিটি ব্যবহার করতে হবে।
- কোনো ডেপ্রিকেটেড বা ব্যাকওয়ার্ড ক্লাস ব্যবহার করা যাবে না।

### 🗄️ ৪. TanStack Query v5 & TanStack Table v8 ([tanstack.com](https://tanstack.com))
- **TanStack Query v5**: অবশ্যই আধুনিক অবজেক্ট সিনট্যাক্স ব্যবহার করতে হবে:
  `useQuery({ queryKey: ['fabricRolls'], queryFn: fetchRolls })`
  (পুরোনো v4 পজিশনাল আর্গুমেন্ট `useQuery(['fabricRolls'], fetchRolls)` কঠোরভাবে নিষিদ্ধ)।
- **TanStack Table v8**: অফিশিয়াল `useReactTable` এপিআই ও কলাম ডেফিনিশন (`createColumnHelper`) মেনে চলতে হবে।

### 🐘 ৫. PostgreSQL 16/17 ([postgresql.org/docs](https://www.postgresql.org/docs))
- আধুনিক ডেটা টাইপ: `UUID`, `TIMESTAMPTZ`, `NUMERIC(15,4)`, `JSONB`।
- ডেটাবেজ ইনডেক্সিংয়ে আধুনিক B-Tree ও JSONB-এর জন্য GIN ইনডেক্স ব্যবহার।

---

## ৩. জিরো-ডেপ্রিকেশন নীতি (Zero Deprecated Code)
- কোড কম্পাইল করার সময় কোনো `@Deprecated` ওয়ার্নিং আসা যাবে না।
- যদি কোনো ডিপেনডেন্সি মেথডকে ডেপ্রিকেটেড ঘোষণা করে থাকে, তবে অফিশিয়াল গাইড অনুযায়ী তার আধুনিক বিকল্পটিই ব্যবহার করতে হবে।

---

## ৪. কিউএ অডিট গেট (Farhana's Gate)
- [ ] কোডের কোথাও কি কোনো ডেপ্রিকেটেড মেথড বা পুরোনো `javax.*` ইমপোর্ট আছে? (থাকলে ❌ REJECTED)।
- [ ] TanStack Query বা Spring Security-তে কি লেটেস্ট সিনট্যাক্স ব্যবহার হয়েছে? (না হলে ❌ REJECTED)।
