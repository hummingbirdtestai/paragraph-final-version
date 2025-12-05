// components/chat/Renderers.tsx
import React from 'react';
import { View, Text, ScrollView, Pressable, FlatList } from 'react-native';
import { MotiView } from 'moti';
import { theme } from '@/constants/theme';
import { MarkupText } from "@/components/chat/MarkupText";

// simple fade-in wrapper for each renderer
const FadeIn = ({ children }: { children: React.ReactNode }) => (
  <MotiView
    from={{ opacity: 0, translateY: 8 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: 'timing', duration: 500 }}
    style={{ marginVertical: theme.spacing.sm }}
  >
    {children}
  </MotiView>
);

/* ───────────────────────────────
   🧠 TEXTUAL / NARRATIVE RENDERERS
──────────────────────────────── */

export const TextExplanation = ({ text }: { text: string }) => (
  <FadeIn>
    <View
      style={{
        backgroundColor: theme.colors.mentorBubble,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
      }}
    >
      <MarkupText content={text} />
    </View>
  </FadeIn>
);

export const SummaryParagraph = ({ text }: { text: string }) => (
  <FadeIn>
    <View
      style={{
        backgroundColor: '#1a1a1a',
        borderLeftWidth: 3,
        borderLeftColor: '#3b82f6',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
      }}
    >
      <MarkupText content={text} />
    </View>
  </FadeIn>
);

export const StepByStep = ({ steps }: { steps: string[] }) => (
  <FadeIn>
    <View>
      {steps.map((s, i) => (
        <View
          key={i}
          style={{
            backgroundColor: '#181818',
            borderRadius: 20,
            marginVertical: 4,
            paddingVertical: 8,
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: theme.colors.accent,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 8,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>{i + 1}</Text>
          </View>
          <MarkupText content={s} />
        </View>
      ))}
    </View>
  </FadeIn>
);

export const ExampleBlock = ({ text }: { text: string }) => (
  <FadeIn>
    <View
      style={{
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
        backgroundColor: '#111',
        padding: theme.spacing.md,
      }}
    >
      <MarkupText content={text} />
    </View>
  </FadeIn>
);

export const Storytelling = ({ text }: { text: string }) => (
  <FadeIn>
    <View
      style={{
        backgroundColor: '#121212',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
      }}
    >
      <MarkupText content={text} />
    </View>
  </FadeIn>
);

export const Quote = ({ text }: { text: string }) => (
  <FadeIn>
    <View
      style={{
        alignItems: 'center',
        marginVertical: theme.spacing.md,
      }}
    >
      <MarkupText content={`“${text}”`} />
    </View>
  </FadeIn>
);

export const DialogueSnippet = ({
  dialogue,
}: {
  dialogue: { speaker: string; text: string }[];
}) => (
  <FadeIn>
    <View style={{ gap: theme.spacing.sm }}>
      {dialogue.map((d, i) => (
        <View
          key={i}
          style={{
            flexDirection: d.speaker === 'AI' ? 'row' : 'row-reverse',
            justifyContent: 'flex-start',
          }}
        >
          <View
            style={{
              backgroundColor:
                d.speaker === 'AI'
                  ? theme.colors.mentorBubble
                  : theme.colors.studentBubble,
              borderRadius: theme.borderRadius.md,
              padding: theme.spacing.md,
              maxWidth: '80%',
            }}
          >
            <MarkupText content={`${d.speaker}: ${d.text}`} />
          </View>
        </View>
      ))}
    </View>
  </FadeIn>
);

export const CodeExplanation = ({ code }: { code: string }) => (
  <FadeIn>
    <View
      style={{
        backgroundColor: '#0d1117',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
      }}
    >
      <Text style={{ color: '#7dd3fc', fontFamily: 'FiraCode-Regular' }}>{code}</Text>
    </View>
  </FadeIn>
);

/* ───────────────────────────────
   🔹 LIST / FACT RENDERERS
──────────────────────────────── */

export const HYFList = ({ items }: { items: string[] }) => (
  <FadeIn>
    <View
      style={{
        backgroundColor: '#1a1a1a',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
      }}
    >
      {items.map((item, i) => (
        <MarkupText key={i} content={`⭐ ${item}`} />
      ))}
    </View>
  </FadeIn>
);

export const ProsConsList = ({
  pros,
  cons,
}: {
  pros: string[];
  cons: string[];
}) => (
  <FadeIn>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ flex: 1, marginRight: 8 }}>
        {pros.map((p, i) => (
          <MarkupText key={i} content={`✅ ${p}`} />
        ))}
      </View>
      <View style={{ flex: 1, marginLeft: 8 }}>
        {cons.map((c, i) => (
          <MarkupText key={i} content={`❌ ${c}`} />
        ))}
      </View>
    </View>
  </FadeIn>
);

export const KeyPoints = ({ points }: { points: string[] }) => (
  <FadeIn>
    <View>
      {points.map((p, i) => (
        <View
          key={i}
          style={{
            backgroundColor: '#0f172a',
            borderRadius: theme.borderRadius.lg,
            marginVertical: 4,
            padding: theme.spacing.md,
          }}
        >
          <MarkupText content={`${i + 1}. ${p}`} />
        </View>
      ))}
    </View>
  </FadeIn>
);

export const Checklist = ({
  items,
}: {
  items: { text: string; checked: boolean }[];
}) => (
  <FadeIn>
    <View>
      {items.map((i, idx) => (
        <MarkupText key={idx} content={`☑ ${i.text}`} />
      ))}
    </View>
  </FadeIn>
);

export const TimelineList = ({ events }: { events: string[] }) => (
  <FadeIn>
    <View style={{ borderLeftWidth: 2, borderLeftColor: '#0891b2', paddingLeft: 12 }}>
      {events.map((e, i) => (
        <View key={i} style={{ marginBottom: 6 }}>
          <Text style={{ color: theme.colors.text }}>• {e}</Text>
        </View>
      ))}
    </View>
  </FadeIn>
);

export const MnemonicList = ({ items }: { items: string[] }) => (
  <FadeIn>
    <View>
      {items.map((it, i) => {
        const first = it.charAt(0).toUpperCase();
        const rest = it.slice(1);
        return (
          <Text key={i} style={{ color: '#fbbf24' }}>
            <Text style={{ fontWeight: '700', color: '#fde68a' }}>{first}</Text>
            {rest}
          </Text>
        );
      })}
    </View>
  </FadeIn>
);

/* ───────────────────────────────
   🧩 ASSESSMENT / INTERACTIVE RENDERERS
──────────────────────────────── */


export const MCQBlock = ({
  stem,
  options,
  correct,
  feedback,
}: {
  stem: string;
  options: string[];
  correct: number;
  feedback: { correct: string; wrong: string };
}) => {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <FadeIn>
      <View
        style={{
          backgroundColor: '#111',
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.lg,
        }}
      >
        <Text style={{ color: '#fff', marginBottom: 8 }}>{stem}</Text>
        {options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === correct;
          const bg =
            selected !== null
              ? isSelected && isCorrect
                ? '#166534'
                : isSelected
                ? '#7f1d1d'
                : '#1e1e1e'
              : '#1e1e1e';
          return (
            <Pressable
              key={i}
              onPress={() => setSelected(i)}
              style={{
                backgroundColor: bg,
                borderRadius: 8,
                padding: 10,
                marginVertical: 4,
              }}
            >
              <Text style={{ color: '#fff' }}>{opt}</Text>
            </Pressable>
          );
        })}
        {selected !== null && (
          <Text
            style={{
              marginTop: 8,
              color: selected === correct ? '#22c55e' : '#ef4444',
            }}
          >
            {selected === correct ? feedback.correct : feedback.wrong}
          </Text>
        )}
      </View>
    </FadeIn>
  );
};

export const TrueFalse = ({
  statement,
  answer,
}: {
  statement: string;
  answer: boolean;
}) => {
  const [picked, setPicked] = useState<boolean | null>(null);
  return (
    <FadeIn>
      <View style={{ backgroundColor: '#111', padding: 14, borderRadius: 10 }}>
        <Text style={{ color: '#fff', marginBottom: 10 }}>{statement}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <Pressable
            onPress={() => setPicked(true)}
            style={{
              backgroundColor: picked === true ? '#166534' : '#1e1e1e',
              padding: 10,
              borderRadius: 6,
              width: '40%',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#22c55e', fontWeight: '600' }}>✅ True</Text>
          </Pressable>
          <Pressable
            onPress={() => setPicked(false)}
            style={{
              backgroundColor: picked === false ? '#7f1d1d' : '#1e1e1e',
              padding: 10,
              borderRadius: 6,
              width: '40%',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#ef4444', fontWeight: '600' }}>❌ False</Text>
          </Pressable>
        </View>
        {picked !== null && (
          <Text
            style={{
              color: picked === answer ? '#22c55e' : '#ef4444',
              marginTop: 8,
              textAlign: 'center',
            }}
          >
            {picked === answer ? 'Correct!' : 'Try again'}
          </Text>
        )}
      </View>
    </FadeIn>
  );
};

export const FlashcardSet = ({
  cards,
}: {
  cards: { q: string; a: string }[];
}) => {
  const [flipped, setFlipped] = useState<number | null>(null);
  return (
    <FadeIn>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {cards.map((c, i) => (
          <Pressable
            key={i}
            onPress={() => setFlipped(flipped === i ? null : i)}
            style={{
              backgroundColor: '#1a1a1a',
              borderRadius: 12,
              width: 180,
              marginRight: 10,
              padding: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center' }}>
              {flipped === i ? c.a : c.q}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </FadeIn>
  );
};

export const ReflectionPrompt = ({ prompt }: { prompt: string }) => (
  <FadeIn>
    <View
      style={{
        backgroundColor: '#1b1b1b',
        borderRadius: 12,
        padding: 12,
      }}
    >
      <MarkupText content={prompt} />
    </View>
  </FadeIn>
);

export const ConfidencePoll = ({
  label,
}: {
  label: string;
}) => {
  const [val, setVal] = useState(50);
  return (
    <FadeIn>
      <View style={{ padding: 10 }}>
        <Text style={{ color: '#fff', marginBottom: 8 }}>{label}</Text>
        <View
          style={{
            backgroundColor: '#222',
            borderRadius: 10,
            height: 8,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              backgroundColor: '#2563eb',
              width: `${val}%`,
              height: 8,
            }}
          />
        </View>
        <Text
          style={{
            color: '#7dd3fc',
            marginTop: 4,
            textAlign: 'center',
          }}
        >
          {val}% confident
        </Text>
      </View>
    </FadeIn>
  );
};

/* ───────────────────────────────
   🎥 MEDIA / VISUAL RENDERERS
──────────────────────────────── */

export const ImageExplanation = ({
  uri,
  caption,
}: {
  uri: string;
  caption: string;
}) => (
  <FadeIn>
    <View style={{ alignItems: 'center' }}>
      <Image
        source={{ uri }}
        style={{
          width: '100%',
          height: 200,
          borderRadius: 10,
          marginBottom: 6,
        }}
        resizeMode="cover"
      />
      <Text style={{ color: '#aaa', fontSize: 13 }}>{caption}</Text>
    </View>
  </FadeIn>
);

export const MediaSuggestion = ({
  thumbnail,
  title,
  onPress,
}: {
  thumbnail: string;
  title: string;
  onPress: () => void;
}) => (
  <FadeIn>
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        backgroundColor: '#111',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
      }}
    >
      <Image
        source={{ uri: thumbnail }}
        style={{ width: 80, height: 60, borderRadius: 6, marginRight: 10 }}
      />
      <Text style={{ color: '#fff', flexShrink: 1 }}>{title}</Text>
    </Pressable>
  </FadeIn>
);

export const ChartData = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <FadeIn>
    <View
      style={{
        backgroundColor: '#0f172a',
        borderRadius: 10,
        padding: 10,
      }}
    >
      <Text style={{ color: '#7dd3fc', fontWeight: '600' }}>{title}</Text>
      <Text style={{ color: '#eaeaea', marginTop: 4 }}>{description}</Text>
    </View>
  </FadeIn>
);

/* ───────────────────────────────
   📊 TABULAR / COMPARATIVE RENDERERS
──────────────────────────────── */

export const TabularSummary = ({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) => (
  <FadeIn>
    <ScrollView horizontal>
      <View>
        <View style={{ flexDirection: 'row', backgroundColor: '#111' }}>
          {headers.map((h, i) => (
            <Text
              key={i}
              style={{
                color: '#7dd3fc',
                fontWeight: '700',
                width: 120,
                padding: 6,
                textAlign: 'center',
              }}
            >
              {h}
            </Text>
          ))}
        </View>
        {rows.map((r, ri) => (
          <View key={ri} style={{ flexDirection: 'row' }}>
            {r.map((cell, ci) => (
              <Text
                key={ci}
                style={{
                  color: '#eaeaea',
                  width: 120,
                  padding: 6,
                  textAlign: 'center',
                  backgroundColor: ri % 2 === 0 ? '#1a1a1a' : '#111',
                }}
              >
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  </FadeIn>
);

export const RankingList = ({
  items,
}: {
  items: string[];
}) => (
  <FadeIn>
    <View>
      {items.map((item, i) => (
        <View
          key={i}
          style={{
            backgroundColor: i === 0 ? '#facc15' : i === 1 ? '#9ca3af' : '#92400e',
            borderRadius: 8,
            padding: 10,
            marginVertical: 4,
          }}
        >
          <Text style={{ color: '#000', fontWeight: '700' }}>
            {i + 1}. {item}
          </Text>
        </View>
      ))}
    </View>
  </FadeIn>
);

/* ───────────────────────────────
   📈 ANALYTICAL / FEEDBACK RENDERERS
──────────────────────────────── */


export const CognitiveLoadMeter = ({ level }: { level: number }) => (
  <FadeIn>
    <View
      style={{
        alignItems: "center",
        padding: 12,
        backgroundColor: "#111",
        borderRadius: 12,
      }}
    >
      <Text style={{ color: "#7dd3fc", marginBottom: 8 }}>Cognitive Load</Text>
      <View
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          borderWidth: 8,
          borderColor: "#38bdf8",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#eaeaea", fontSize: 22, fontWeight: "700" }}>
          {level}%
        </Text>
      </View>
    </View>
  </FadeIn>
);

export const MasteryFeedback = ({ emoji, text }: { emoji: string; text: string }) => (
  <FadeIn>
    <View
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: 10,
        padding: 12,
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 28 }}>{emoji}</Text>
      <MarkupText content={text} />
    </View>
  </FadeIn>
);

export const ErrorAnalysis = ({
  rows,
}: {
  rows: { error: string; correction: string; explanation: string }[];
}) => (
  <FadeIn>
    <View>
      {rows.map((r, i) => (
        <View
          key={i}
          style={{
            backgroundColor: "#111",
            borderRadius: 10,
            marginBottom: 6,
            padding: 10,
          }}
        >
          <Text style={{ color: "#ef4444" }}>❌ {r.error}</Text>
          <Text style={{ color: "#22c55e" }}>✅ {r.correction}</Text>
          <Text style={{ color: "#eaeaea" }}>{r.explanation}</Text>
        </View>
      ))}
    </View>
  </FadeIn>
);

export const LearningGapReport = ({
  gaps,
}: {
  gaps: { gap: string; fix: string }[];
}) => (
  <FadeIn>
    <View>
      {gaps.map((g, i) => (
        <View
          key={i}
          style={{
            backgroundColor: "#1a1a1a",
            borderLeftWidth: 3,
            borderLeftColor: "#f59e0b",
            marginBottom: 6,
            padding: 10,
          }}
        >
          <Text style={{ color: "#fbbf24" }}>Gap: {g.gap}</Text>
          <Text style={{ color: "#22d3ee" }}>Fix: {g.fix}</Text>
        </View>
      ))}
    </View>
  </FadeIn>
);

/* ───────────────────────────────
   💬 CONVERSATIONAL / SYSTEM CONTROL
──────────────────────────────── */

export const ConversationReply = ({ text }: { text: string }) => (
  <FadeIn>
    <View
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: 10,
        padding: 10,
      }}
    >
      <Text style={{ color: "#eaeaea" }}>{text}</Text>
    </View>
  </FadeIn>
);

export const ActionPrompt = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <FadeIn>
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: "#2563eb",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignSelf: "center",
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "600" }}>{label}</Text>
    </Pressable>
  </FadeIn>
);

export const SystemMessage = ({ text }: { text: string }) => (
  <FadeIn>
    <Text
      style={{
        color: "#aaa",
        textAlign: "center",
        fontSize: 12,
        marginVertical: 4,
      }}
    >
      {text}
    </Text>
  </FadeIn>
);

export const ChapterCompletion = () => (
  <FadeIn>
    <View style={{ alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 40 }}>🏆</Text>
      <Text style={{ color: "#7dd3fc", fontSize: 16, marginTop: 6 }}>
        Chapter Completed!
      </Text>
    </View>
  </FadeIn>
);

/* ───────────────────────────────
   🧩 SIMULATION / PROBLEM-SOLVING
──────────────────────────────── */

export const CaseScenario = ({
  vignette,
}: {
  vignette: { title: string; content: string; labs?: string[] };
}) => (
  <FadeIn>
    <View
      style={{
        backgroundColor: "#111",
        borderRadius: 10,
        padding: 12,
      }}
    >
      <Text style={{ color: "#7dd3fc", fontWeight: "600", marginBottom: 6 }}>
        {vignette.title}
      </Text>
      <Text style={{ color: "#eaeaea" }}>{vignette.content}</Text>
      {vignette.labs && (
        <View style={{ marginTop: 8 }}>
          {vignette.labs.map((lab, i) => (
            <Text key={i} style={{ color: "#22d3ee" }}>
              • {lab}
            </Text>
          ))}
        </View>
      )}
    </View>
  </FadeIn>
);

export const BranchingDecision = ({
  choices,
  onSelect,
}: {
  choices: string[];
  onSelect: (c: string) => void;
}) => (
  <FadeIn>
    <View>
      {choices.map((c, i) => (
        <Pressable
          key={i}
          onPress={() => onSelect(c)}
          style={{
            backgroundColor: "#1e1e1e",
            padding: 10,
            borderRadius: 8,
            marginVertical: 4,
          }}
        >
          <Text style={{ color: "#7dd3fc", textAlign: "center" }}>{c}</Text>
        </Pressable>
      ))}
    </View>
  </FadeIn>
);

export const RolePlay = ({
  exchanges,
}: {
  exchanges: { role: string; line: string }[];
}) => (
  <FadeIn>
    <View>
      {exchanges.map((e, i) => (
        <View
          key={i}
          style={{
            flexDirection: e.role === "Patient" ? "row" : "row-reverse",
            marginVertical: 3,
          }}
        >
          <View
            style={{
              backgroundColor:
                e.role === "Patient" ? "#1a1a1a" : "#0f172a",
              borderRadius: 10,
              padding: 8,
              maxWidth: "75%",
            }}
          >
            <Text style={{ color: "#eaeaea" }}>{e.line}</Text>
          </View>
        </View>
      ))}
    </View>
  </FadeIn>
);

/* ───────────────────────────────
   🎨 CREATIVE / GENERATIVE FORMATS
──────────────────────────────── */

export const MentorReflection = ({ text }: { text: string }) => (
  <FadeIn>
    <View
      style={{
        borderLeftWidth: 3,
        borderLeftColor: "#a78bfa",
        paddingLeft: 10,
      }}
    >
      <MarkupText content={`“${text}”`} />
    </View>
  </FadeIn>
);

export const PoeticExplanation = ({ text }: { text: string }) => (
  <FadeIn>
    <MarkupText content={text} />
  </FadeIn>
);

export const MotivationalQuote = ({ text }: { text: string }) => (
  <FadeIn>
    <View
      style={{
        backgroundColor: "linear-gradient(90deg, #4338ca, #2563eb)",
        borderRadius: 12,
        padding: 14,
      }}
    >
      <MarkupText content={text} />
    </View>
  </FadeIn>
);

export const MetaphoricalTeaching = ({
  text,
  image,
}: {
  text: string;
  image: string;
}) => (
  <FadeIn>
    <View
      style={{
        backgroundColor: "#111",
        borderRadius: 12,
        padding: 10,
      }}
    >
      <MarkupText content={text} />
      <View
        style={{
          width: "100%",
          height: 150,
          backgroundColor: "#1a1a1a",
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            color: "#7dd3fc",
            textAlign: "center",
            marginTop: 60,
          }}
        >
          [Image: {image}]
        </Text>
      </View>
    </View>
  </FadeIn>
);

export const DailyTip = ({ text }: { text: string }) => (
  <FadeIn>
    <View
      style={{
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        backgroundColor: "#2563eb",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
      }}
    >
      <MarkupText content={text} />
    </View>
  </FadeIn>
);
