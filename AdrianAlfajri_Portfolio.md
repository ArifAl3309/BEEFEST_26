## Hello, | am Adrian Alfajri an Al Engineer building intelligent applications based in South Tangerang, Indonesia.

| build Al systems across web, mobile, and loT platforms with a strong interest in RAG architectures and conversational Al that solve real-world problems.


## Canopya

An intelligent conversational assistant combining RAG, LLM, and rule-based diagnostics to provide real-time hydroponic guidance through WhatsApp

Sep 2025 - Jan 2026 Al Engineer (LLM+RAG)


## PROBLEM

- Farmers struggle to interpret raw sensor data (pH numbers, graphs)

- No way to ask "What should | do if pH is 4.5?" in natural language

- Generic advice doesn't account for current system state

- Hydroponic knowledge scattered across multiple sources

## Solution : A Hybrid Chatbot

- « Answer knowledge questions using RAG (1000+ documents)

- Diagnose sensor readings with rule-based analytics

- Provide personalized recommendations with real-time data + predictions

- Deliver via WhatsApp - no app installation needed


## Hybrid Multi-Engine Architecture

- RAG Engine » Knowledge questions (1000+ docs, vector search)

- Rule-Based Sensor diagnostics (pH thresholds, severity analysis)

## Tech Stack


## Hybrid Multi-Engine Architecture

- "Bagaimana cara pH?" RAG

- "pH saya 4.5" Rule-Based

- "pH 4.5, bagaimana cara naik?" => Hybrid (both engines)


## RAG PIPELINE


## CHATBOT PREVIEW


## Built a production-ready chatbot that:

- Answers hydroponic questions with 87% retrieval precision

- Diagnoses sensor readings with 94% accuracy

- Responds in 2.1 seconds (median)

- Handles follow-up questions with 88% context retention

## Why it matters:

- \* Beats generic LLM (ChatGPT) by 18% on domain accuracy

- Reduces hallucination from 22% to 4%

- \* Provides real-time sensor insights + preventive warnings

- \* Available 24/7 via WhatsApp - no app needed

Repository

## Try it live

[test.canopya.cloud](https://test.canopya.cloud)


## KEY LEARNINGS

- 1. Production RAG = 80% Engineering, 20% Model

- Built pipeline from scratch: scraping = chunking embedding = retrieval generation

- Improved precision 72% -> 87% through hybrid search + reranking

- Reduced hallucination 18% => 4% with strict prompting

- 2. Multi-Engine Orchestration

- Intent routing: RAG vs Rule-Based vs Hybrid

- Parallel execution for speed, graceful degradation for reliability

- Context management: 88% follow-up accuracy with 30-min sessions

A 3B LLM with good prompting beats 13B with poor UX. Production Al is about system design, not just model selection


## Klar

Al conversation engine that automates troubleshooting workflows and structured data collection for Honeywell customer support

Nov 2025 - Des 2025 Al Engineer | MacOS Development


## CHALLENGE

Honeywell Indonesia's customer support team was drowning in repetitive technical complaints. Each basic troubleshooting session consumed 15-30 minutes of CS time, with solutions varying wildly across different agents. The data collection process for technician escalations was fragmented and incomplete, leading to delays and inefficiencies in resolving customer issues.

## THE SOLUTION GOAL

We set out to build an Al chatbot that could handle common issues instantly while maintaining the professional service quality Honeywell is known for. The target was clear: reduce response time to under 2 minutes, achieve 100% consistency in troubleshooting procedures, and ensure complete structured data collection for every escalation case.


## THE SOLUTION

## Built an LLM-powered conversation engine using Qwen3 4B-Instruct that:

- Understands Indonesian natural language (including typo & slang)

- Guides customers through SOP-based troubleshooting flows

- Collects structured data conversationally

## WHY LOCAL LLM?

- v Privacy: Customer data stays on-premise

- v Cost: \$0 per request vs \$300+/month cloud API

- v Speed: 1.8s response time

- v Control: Full customization capability

Hybrid system combining strict SOP templates (for troubleshooting steps) with LLM generation (for natural conversation)

Text normalization layer before LLM processing solved Indonesian language variability: "udh coba ga nyala" = "sudah dicoba tidak menyala" = accurate intent detection


## SYSTEM ARCHITECTURE

## TECH STACK

Gao iE


## PERFORMANCE METRICS

The system achieved 94.2% intent detection accuracy, a significant improvement from the 67% baseline of rule-based approaches. Response time averaged 1.8 seconds while maintaining 100% SOP compliance across all troubleshooting flows.

## BUSINESS IMPACT

Handling time dropped by 87%, from 30 minutes down to just 2 minutes per case. This translated to \$4,500 in monthly cost savings while improving data completeness from 45% to 98% for escalation cases.

## THE ITERATION JOURNEY

The first attempt with pure rule-based logic proved too rigid, achieving only 67% accuracy. Cloud API solutions offered better results but came with high costs and latency issues. A third attempt using Llama 2 struggled with Indonesian language support. The final implementation combined Qwen3 with text normalization, achieving 94% accuracy at zero recurring cost.


## APP PREVIEW

## Repository

[https://github.com/AlphaJri/klar-chatbot.git](https://github.com/AlphaJr1/klar-chatbot.git)


## TECHNICAL GROWTH

This project pushed me into production conversational Al with local LLM optimization. The biggest challenge was balancing strict SOP compliance with natural, human conversation.

## THE DEFINING CHALLENGE

Indonesian customers write "udh coba ga nyala" instead of formal text. The system needed to understand these variations perfectly. The solution: hybrid templates for critical steps, LLM for conversation, and text normalization to standardize input. Result: 94% accuracy.

## KEY INSIGHT

Production Al is 20% model selection, 80% engineering. Error handling, state management, and monitoring matter more than the fanciest model.

## PERSONAL TAKEAWAY

Local LLMs can outperform cloud APIs when optimized properly. Constraints aren't limitations, they're design parameters that drive creative solutions.


## Calthy

Al-powered soil analysis through camera-based scanning for preventive Calathea plant care


## BACKGROUND

Born from Apple Academy challenge focused on Calathea ornata - a stunning yet notoriously difficult houseplant. My mentor, a Calathea enthusiast, kept losing plants to sudden leaf browning with no early warning. By the time symptoms appeared, damage was irreversible.

## THE PROBLEM

- « Manual soil test kits cost \$20-70 USD with limited uses

- Plant owners can't detect early soil degradation - when leaves brown, it's too late

- « Calathea highly sensitive to pH (5.5-7.0), NPK imbalance, and moisture - invisible to naked eye

- Existing apps only give generic reminders, not actual soil condition insights

## PROJECT GOALS

- Democratize soil testing - anyone with iPhone can analyze soil from a photo

- Early stress detection - predict problems before visible plant damage

- « Actionable insights - specific recommendations, not just "pH is low"


## METHODOLOGY

Camera-based ML soil analysis - accessible smartphone alternative to expensive sensor monitoring

## DATA

- Public agricultural datasets + synthetic augmentation

- Size: ~5,000 labeled soil samples (RGB/HSV, pH, NPK)

- Real-time WeatherKit API (temp, humidity, location)

- Challenges overcome:

- conversion Lighting variability constant flash mode + HSV

- Class imbalance oversampling + SMOTE

## KEY DECISIONS

- 1. Model Selection pH: Gradient Boosted Regression | NPK: Random Forest Classifier Neural overfitted on small dataset

- 2. Feature Engineering: RGB + HSV (not just RGB) Result: pH accuracy improved 23% (RMSE 0.89 to 0.68) HSV is lighting-robust and captures intrinsic soil color

- 3. Indoor/Outdoor Adaptive Models Outdoor: Direct weather data to soil predictions Indoor: Time-cyclic features for climate estimation Trade-off: Added complexity for 31% better indoor accuracy

CoreML on-device ML optimization Impact <200ms, fully offline dan game-changer for UX and data privacy


## How it works?


## Let’s deep dive into each models!

LimeSoDa (Schmidinger et al., 2025). SSP460 (no specific location), SC93 (near Brazil and Uruguay), SP231 (near Japan and Russia). Total of 784 data.

## It’s not perfect...

Although there are some studies that proved the use of spectroscopy (Yang et al., 2019) and camera/color (Fan et al., 2017; G Nair, 2019; BARMAN, 2019) for predicting soil pH level, we don’t know how much the model will degrade from the effect of compressing spectroscopy data to RGB & HSV values, so further testing is still needed.


## How to predict the nutrients?

Soil-NPK Dataset (Coutinho et al., 2019).

Sandy and Clayey lab treated dried to 45°C and sieved to 2mm’s and 0.71mm’s.

Total of 400 data.

## There are some caveats...

- Due to the limitation of the dataset, we can only use lab treated sandy and clayey soil which might not generalized well to real life soil condition.

- We couldn’t use the lower end of visible light from the spectroscopy because the data starts from 450nm of wavelength.

- The nutrients class is imbalanced towards the ‘High’ and/or ‘Medium’ class, it might create bias.


## Smart Prediction. No Sensors Needed


## Primary Models

- SoilpHRegressor: Gradient Boosted Trees (RGB + HSV - pH 4.0-9.0)

- NPK Classifiers: 3 Random Forest models (Low/Medium/High categories)

- Environmental: 7 models for soil moisture, temperature, indoor climate

## KEY BREAKTHROUGH

- Problem: Camera auto-exposure caused inconsistent RGB values

- \* Solution: Constant flash mode dominant color binning algorithm

- Impact: Variance reduced 67%

- Learning: Preprocessing often more important than model complexity

## PERFORMANCE METRICS

F1-scores Overall accuracy: 79%


## RESULTS

- « Native iOS app with 13 CoreML models Mastered CoreML, Computer Vision, (4.2 MB), 87% pH accuracy in and SwiftUl MVVM architecture 420ms, fully offline

- « Tested with 8 users, 100% success Solved lighting (67% better), indoor FREE alternative to \$20-70 kit predictions, and speed (2.1s to 420ms) "Saved my Calathea" through flash mode and parallelization

## Repository

[https://github.com/Oki-B/ADA-C8-C4-Chlorophyll.git](https://github.com/Oki-B/ADA-C8-C4-Chlorophyll.git)
