import {Composition} from 'remotion';
import {IntroVideo} from './IntroVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ProjectIdeaStudioIntro"
        component={IntroVideo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Project Idea Studio',
          tagline: 'Open and use, no auth, stored in the local'
        }}
      />
    </>
  );
};
