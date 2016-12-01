//
//  SplashViewController.m
//  Bridgeme
//
//  Created by Mingyu Kim on 2016. 11. 30..
//  Copyright © 2016년 Facebook. All rights reserved.
//

#import "SplashViewController.h"
#import "FLAnimatedImage.h"

@interface SplashViewController ()

@end

@implementation SplashViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  
  NSURL *url = [[NSBundle mainBundle] URLForResource:@"splash_anim" withExtension:@"gif"];
  NSData *data = [NSData dataWithContentsOfURL:url];
  FLAnimatedImage *image = [FLAnimatedImage animatedImageWithGIFData:data];
  FLAnimatedImageView *imageView = [[FLAnimatedImageView alloc] init];
  imageView.animatedImage = image;
  imageView.frame = CGRectMake(0.0, 0.0, self.view.frame.size.width, self.view.frame.size.height);
  [self.view addSubview:imageView];
}

- (void)didReceiveMemoryWarning {
  [super didReceiveMemoryWarning];
}

@end
