import React from 'react';
import {
  AbsoluteFill,
  Audio,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';

import {OpeningScene} from './scenes/OpeningScene';
import {LocalStorageScene} from './scenes/LocalStorageScene';
import {ThemeScene} from './scenes/ThemeScene';
import {ServiceMonitorScene} from './scenes/ServiceMonitorScene';
import {ModelUsageScene} from './scenes/ModelUsageScene';
import {AutoUpdateScene} from './scenes/AutoUpdateScene';
import {GanttScene} from './scenes/GanttScene';
import {HistoryScene} from './scenes/HistoryScene';
import {FeaturesOverviewScene} from './scenes/FeaturesOverviewScene';
import {ClosingScene} from './scenes/ClosingScene';

export type IntroVideoProps = {
  title: string;
  tagline: string;
};

export const IntroVideoWithMusic: React.FC<IntroVideoProps> = ({
  title,
  tagline,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const transitionDuration = 20;

  // Fade in music over first 2 seconds
  const fadeIn = interpolate(frame, [0, 60], [0, 0.35], {
    extrapolateRight: 'clamp',
  });

  // Fade out music over last 2 seconds
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 60, durationInFrames],
    [0.35, 0],
    {extrapolateLeft: 'clamp'}
  );

  // Use the minimum of fade in and fade out
  const musicVolume = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill>
      {/* 🎵 Background Music with Fade In/Out */}
      {/* Place your music.mp3 file in the public/ folder */}
      <Audio src={staticFile('music.mp3')} volume={musicVolume} />

      <TransitionSeries>
        {/* Opening - 4 seconds */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <OpeningScene title={title} tagline={tagline} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: transitionDuration})}
        />

        {/* Local Storage - 3 seconds */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <LocalStorageScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({direction: 'from-right'})}
          timing={linearTiming({durationInFrames: transitionDuration})}
        />

        {/* Theme Toggle - 3 seconds */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <ThemeScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({direction: 'from-left'})}
          timing={linearTiming({durationInFrames: transitionDuration})}
        />

        {/* Service Monitor - 2.5 seconds */}
        <TransitionSeries.Sequence durationInFrames={75}>
          <ServiceMonitorScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: transitionDuration})}
        />

        {/* Model Usage - 3 seconds */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <ModelUsageScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({direction: 'from-bottom'})}
          timing={linearTiming({durationInFrames: transitionDuration})}
        />

        {/* Auto Update - 2.5 seconds */}
        <TransitionSeries.Sequence durationInFrames={75}>
          <AutoUpdateScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: transitionDuration})}
        />

        {/* Gantt Timeline - 3 seconds */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <GanttScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({direction: 'from-top'})}
          timing={linearTiming({durationInFrames: transitionDuration})}
        />

        {/* History Charts - 3 seconds */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <HistoryScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: transitionDuration})}
        />

        {/* Features Overview - 3 seconds */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <FeaturesOverviewScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: transitionDuration})}
        />

        {/* Closing - 3 seconds */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <ClosingScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
