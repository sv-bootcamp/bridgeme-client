//
//  SplashViewController.m
//  Bridgeme
//
//  Created by Mingyu Kim on 2016. 11. 30..
//  Copyright © 2016년 Facebook. All rights reserved.
//

#import "SplashViewController.h"
#import <YYImage/YYImage.h>

@interface SplashViewController ()

@end

@implementation SplashViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  
  UIImage *image = [YYImage imageNamed:@"splash_anim.gif"];
  UIImageView *imageView = [[YYAnimatedImageView alloc] initWithImage:image];
  imageView.frame = CGRectMake(0.0, 0.0, self.view.frame.size.width, self.view.frame.size.height);
  [self.view addSubview:imageView];
}

- (void)didReceiveMemoryWarning {
  [super didReceiveMemoryWarning];
}

@end
